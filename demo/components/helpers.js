const DEFAULT_FILE_STYLE = 'bg-white text-slate-600 border-slate-200';

const ICON_CLASSES = {
    mp3: { icon: 'fa-volume-up', cls: 'bg-brand/10 text-brand border-brand/30' },
    md: { icon: 'fa-file-text-o', cls: 'bg-slate-900 text-white border-slate-800' },
    markdown: { icon: 'fa-file-text-o', cls: 'bg-slate-900 text-white border-slate-800' },
    pdf: { icon: 'fa-file-pdf-o', cls: 'bg-red-50 text-red-700 border-red-200' },
    html: { icon: 'fa-file-text-o', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    htm: { icon: 'fa-file-text-o', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export function createFileList(song, files = []) {
    const fragment = document.createDocumentFragment();
    (files || []).forEach((file, index) => {
        fragment.appendChild(createFileItem(song, file, index));
    });
    return fragment;
}

function createFileItem(song, file, index) {
    const ext = (file.extension || '').toLowerCase();
    const meta = ICON_CLASSES[ext] || { icon: 'fa-file-o', cls: DEFAULT_FILE_STYLE };
    const li = document.createElement('li');
    li.className = `flex flex-col items-center justify-center gap-2 w-20 h-20 text-center rounded-2xl border shadow-inner shadow-black/10 text-[0.6rem] font-semibold tracking-[0.2em] uppercase ${meta.cls}`;

    const link = document.createElement('a');
    link.href = resolveFileHref(song, file);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'flex flex-col items-center justify-center gap-2 h-full w-full';
    link.dataset.fileIndex = String(index);
    if (file.type === 'lyrics') {
        link.dataset.lyrics = 'true';
    }

    const icon = document.createElement('i');
    icon.className = `fa ${meta.icon} text-xl`;
    const label = document.createElement('span');
    label.textContent = file.filename;

    link.append(icon, label);

    li.appendChild(link);
    return li;
}

function resolveFileHref(song, file) {
    return file.url;
}
