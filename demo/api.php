<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$baseDir = __DIR__ . '/data';
if (!is_dir($baseDir)) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Data directory is missing.'
    ]);
    exit;
}

try {
    $songs = buildSongCollection($baseDir);

    $response = [
        'status' => 'ok',
        'generatedAt' => gmdate(DATE_ATOM),
        'songCount' => count($songs),
        'songs' => $songs,
    ];

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Failed to build song listing.',
        'details' => $e->getMessage(),
    ]);
}

function buildSongCollection(string $baseDir): array
{
    $directories = scandir($baseDir);
    if ($directories === false) {
        throw new RuntimeException('Cannot read song directories.');
    }

    $songs = [];
    foreach ($directories as $entry) {
        if ($entry[0] === '.') {
            continue;
        }

        $songDir = $baseDir . '/' . $entry;
        if (!is_dir($songDir)) {
            continue;
        }

        $songs[] = buildSongPayload($songDir, $entry);
    }

    usort($songs, function (array $a, array $b): int {
        if ($a['status']['archive'] !== $b['status']['archive']) {
            return $a['status']['archive'] <=> $b['status']['archive'];
        }

        return strcasecmp($a['title'], $b['title']);
    });

    return $songs;
}

function buildSongPayload(string $songDir, string $folderName): array
{
    $relativeDir = basename($folderName);
    $manifest = readManifest($songDir . '/manifest.json');

    $files = [];
    $lyrics = null;
    $lyricsPath = null;
    $duration = null;

    $entries = scandir($songDir);
    if ($entries === false) {
        $entries = [];
    }

    foreach ($entries as $entry) {
        if ($entry[0] === '.' || $entry === 'manifest.json') {
            continue;
        }

        $fullPath = $songDir . '/' . $entry;
        if (!is_file($fullPath)) {
            continue;
        }

        $file = buildFileEntry($relativeDir, $entry, $fullPath);
        if ($file['type'] === 'lyrics' && $lyrics === null) {
            $lyrics = [
                'format' => $file['extension'],
                'url' => $file['url'],
                'filename' => $file['filename'],
            ];
            $lyricsPath = $fullPath;
        }

        if ($file['type'] === 'audio' && $file['filename'] === 'demo' && $duration === null) {
            $duration = buildMp3Duration($fullPath);
        }

        $files[] = $file;
    }

    usort($files, function (array $a, array $b): int {
        return strcmp($a['extension'], $b['extension']);
    });

    $title = deriveTitleFromLyrics($lyricsPath) ?? displayNameFromFolder($relativeDir);
    $status = buildStatusPayload($manifest);

    return [
        'id' => $relativeDir,
        'title' => $title,
        'status' => $status,
        'duration' => $duration,
        'lyrics' => $lyrics,
        'files' => $files,
        'meta' => [
            'path' => 'data/' . $relativeDir,
            'manifest' => $manifest,
        ],
    ];
}

function readManifest(string $path): array
{
    if (!is_file($path)) {
        return [];
    }

    $contents = file_get_contents($path);
    if ($contents === false) {
        return [];
    }

    $decoded = json_decode($contents, true);
    return is_array($decoded) ? $decoded : [];
}

function buildFileEntry(string $relativeDir, string $entry, string $fullPath): array
{
    $extension = strtolower(pathinfo($entry, PATHINFO_EXTENSION));
    $filename = pathinfo($entry, PATHINFO_FILENAME);

    return [
        'filename' => $filename,
        'extension' => $extension,
        'type' => determineFileType($extension),
        'url' => sprintf('data/%s/%s', rawurlencode($relativeDir), rawurlencode($entry)),
        'sizeBytes' => filesize($fullPath) ?: null,
    ];
}

function determineFileType(string $extension): string
{
    switch ($extension) {
        case 'mp3':
            return 'audio';
        case 'md':
        case 'markdown':
            return 'lyrics';
        case 'html':
        case 'htm':
            return 'lyrics';
        case 'pdf':
            return 'sheet';
        default:
            return 'file';
    }
}

function buildStatusPayload(array $manifest): array
{
    $value = determineStatusValue($manifest);

    return [
        'value' => $value,
        'archive' => $value === 'archive',
        'new' => $value === 'new',
        'progress' => $value === 'progress',
        'ready' => $value === 'ready',
    ];
}

function determineStatusValue(array $manifest): string
{
    $raw = $manifest['status'] ?? null;
    $normalized = normalizeStatusValue(is_string($raw) ? $raw : null);
    if ($normalized !== null) {
        return $normalized;
    }

    $map = [
        'new' => ['new'],
        'progress' => ['progress'],
        'ready' => ['ready', 'done'],
        'archive' => ['archine', 'archive', 'old'],
    ];

    foreach ($map as $status => $keys) {
        foreach ($keys as $key) {
            if (array_key_exists($key, $manifest) && truthy($manifest[$key])) {
                return $status === 'archive' ? 'archive' : $status;
            }
        }
    }

    if (array_key_exists('progress', $manifest) && !truthy($manifest['progress'])) {
        return 'ready';
    }

    return 'archive';
}

function normalizeStatusValue(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $normalized = strtolower(trim($value));
    if ($normalized === 'archine') {
        return 'archive';
    }
    if ($normalized === 'done') {
        return 'ready';
    }
    $allowed = ['archive', 'new', 'progress', 'ready'];
    return in_array($normalized, $allowed, true) ? $normalized : null;
}

function truthy($value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    if (is_numeric($value)) {
        return (int) $value !== 0;
    }
    if (is_string($value)) {
        return in_array(strtolower(trim($value)), ['1', 'true', 'yes', 'y', 'ano'], true);
    }

    return (bool) $value;
}

function deriveTitleFromLyrics(?string $path): ?string
{
    if ($path === null || !is_readable($path)) {
        return null;
    }

    $contents = file_get_contents($path);
    if ($contents === false) {
        return null;
    }

    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if (in_array($extension, ['md', 'markdown'], true)) {
        $title = titleFromMarkdown($contents);
    } elseif (in_array($extension, ['html', 'htm'], true)) {
        $title = titleFromHtml($contents);
    } else {
        $title = firstNonEmptyLine($contents);
    }

    if ($title === null) {
        return null;
    }

    return trim(html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8')) ?: null;
}

function titleFromMarkdown(string $contents): ?string
{
    if (preg_match('/^\s{0,3}#+\s*(.+)$/m', $contents, $matches)) {
        return trim($matches[1]);
    }

    return firstNonEmptyLine($contents);
}

function titleFromHtml(string $contents): ?string
{
    if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $contents, $matches)) {
        return trim(strip_tags($matches[1]));
    }

    if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $contents, $matches)) {
        return trim(strip_tags($matches[1]));
    }

    $text = strip_tags($contents);
    return firstNonEmptyLine($text);
}

function firstNonEmptyLine(string $text): ?string
{
    $lines = preg_split('/\R/u', $text) ?: [];
    foreach ($lines as $line) {
        $clean = trim($line);
        if ($clean !== '') {
            return $clean;
        }
    }

    return null;
}

function displayNameFromFolder(string $folder): string
{
    $name = str_replace('_', ' ', $folder);
    $name = preg_replace('/\s+/', ' ', $name ?? '');
    return trim($name) ?: $folder;
}

function buildMp3Duration(string $filePath): ?string
{
    if (!is_readable($filePath)) {
        return null;
    }

    $handle = fopen($filePath, 'rb');
    if ($handle === false) {
        return null;
    }

    $header = fread($handle, 10000);
    fclose($handle);

    if ($header === false) {
        return null;
    }

    $xingPos = strpos($header, 'Xing');
    if ($xingPos === false) {
        $xingPos = strpos($header, 'Info');
    }

    if ($xingPos === false) {
        return null;
    }

    $data = unpack('Nframes', substr($header, $xingPos + 8, 4));
    if (!isset($data['frames'])) {
        return null;
    }

    if (!preg_match('/\xFF[\xE0-\xFF][\x00-\xFF]{2}/', $header, $match, PREG_OFFSET_CAPTURE)) {
        return null;
    }

    $offset = $match[0][1];
    $byte2 = ord($header[$offset + 2]);
    $bitrateIndex = ($byte2 & 0xF0) >> 4;
    $bitrates = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];

    if (!isset($bitrates[$bitrateIndex])) {
        return null;
    }

    $bitrate = $bitrates[$bitrateIndex] * 1000;
    if ($bitrate === 0) {
        return null;
    }

    $frames = $data['frames'];
    $durationSeconds = ($frames * 1152) / 44100;

    return gmdate('i:s', (int) $durationSeconds);
}
