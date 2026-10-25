#!/usr/bin/env python3
"""Make hi-hats and the metronome click louder in GeneralUser GS for the demo player.

GeneralUser GS mixes drums for realism: every kit turns its hi-hats down 17.5 dB (snare 3.8 dB) and the
click alphaTab uses for the metronome and count-in (key 33) sits ~16 dB under the snare. In a practice
player both need to cut through, so this lowers the attenuation of the hi-hat zones in every drum kit
(bank 128) and of the key-33 zone inside the kits' instruments. Only generator values change in place:
same file size, same samples.

Usage:
    curl -LO https://raw.githubusercontent.com/mrbumpy409/GeneralUser-GS/main/GeneralUser-GS.sf2
    python3 scripts/boost-soundfont-drums.py GeneralUser-GS.sf2 demo/soundfonts/GeneralUser-GS-RR.sf2
"""
import struct
import sys

BOOST_DB = {'hi-hats': 15, 'metronome click': 15}
METRONOME_KEY = 33  # alphaTab SynthConstants.MetronomeKey
KEY_RANGE, INSTRUMENT, ATTENUATION = 43, 41, 48  # SF2 generator ids


def sub_chunks(data, start, end):
    while start < end:
        cid, size = data[start:start + 4], struct.unpack_from('<I', data, start + 4)[0]
        yield cid.decode(), start + 8, size
        start += 8 + size + (size & 1)


def pdta_offsets(data):
    for cid, off, size in sub_chunks(data, 12, len(data)):
        if cid == 'LIST' and data[off:off + 4] == b'pdta':
            return {sid: soff for sid, soff, _ in sub_chunks(data, off + 4, off + size)}
    raise ValueError('no pdta chunk: not a SoundFont 2 file?')


def boost(data):
    pdta = pdta_offsets(data)
    count = lambda cid, size: (pdta_next(pdta, cid) - pdta[cid]) // size
    presets = [struct.unpack_from('<20sHHH', data, pdta['phdr'] + i * 38) for i in range(count('phdr', 38))]
    name_of = lambda raw: raw.split(b'\0')[0].decode(errors='replace')
    instrument = lambda i: struct.unpack_from('<20sH', data, pdta['inst'] + i * 22)

    def zone_gens(bags, gens_chunk, bag):
        """Generator id -> file offset of its amount, for one preset or instrument zone."""
        first, last = (struct.unpack_from('<H', data, pdta[bags] + b * 4)[0] for b in (bag, bag + 1))
        return {struct.unpack_from('<H', data, pdta[gens_chunk] + g * 4)[0]: pdta[gens_chunk] + g * 4 + 2
                for g in range(first, last)}

    changes, done = [], set()

    def lower(offset, what, where):
        if offset in done:
            return  # instrument shared by several kits
        done.add(offset)
        old = struct.unpack_from('<h', data, offset)[0]
        new = old - BOOST_DB[what] * 10  # centibels; alphaTab's synth also honours negative values
        struct.pack_into('<h', data, offset, new)
        changes.append(f'{what:16} {where:36} {old:5} -> {new:5} cB')

    for p, (raw_name, _, bank, first_bag) in enumerate(presets[:-1]):
        if bank != 128:
            continue
        for bag in range(first_bag, presets[p + 1][3]):
            gens = zone_gens('pbag', 'pgen', bag)
            if INSTRUMENT not in gens:
                continue
            inst_index = struct.unpack_from('<H', data, gens[INSTRUMENT])[0]
            inst_name = name_of(instrument(inst_index)[0])
            where = f'{name_of(raw_name)} / {inst_name}'
            if 'hat' in inst_name.lower():
                if ATTENUATION not in gens:
                    raise ValueError(f'{where}: no attenuation generator to change')
                lower(gens[ATTENUATION], 'hi-hats', where)
                continue
            for ibag in range(instrument(inst_index)[1], instrument(inst_index + 1)[1]):
                igens = zone_gens('ibag', 'igen', ibag)
                if KEY_RANGE in igens and data[igens[KEY_RANGE]] == data[igens[KEY_RANGE] + 1] == METRONOME_KEY:
                    if ATTENUATION not in igens:
                        raise ValueError(f'{where} key {METRONOME_KEY}: no attenuation generator to change')
                    lower(igens[ATTENUATION], 'metronome click', where)
    return changes


def pdta_next(pdta, cid):
    order = ['phdr', 'pbag', 'pmod', 'pgen', 'inst', 'ibag', 'imod', 'igen', 'shdr']
    following = order[order.index(cid) + 1]
    return pdta[following] - 8  # each sub-chunk starts 8 header bytes before its data


if __name__ == '__main__':
    src, dst = sys.argv[1:3]
    data = bytearray(open(src, 'rb').read())
    for line in boost(data):
        print(line)
    open(dst, 'wb').write(data)
