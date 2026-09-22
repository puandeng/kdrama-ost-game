import subprocess
import sys
import struct
import tempfile
import os

def find_loudest_window(filepath, window=10):
    """Find the start time of the loudest 10-second window using raw PCM analysis."""
    # Convert to raw PCM for fast analysis
    with tempfile.NamedTemporaryFile(suffix='.raw', delete=False) as tmp:
        tmppath = tmp.name

    subprocess.run([
        'ffmpeg', '-y', '-v', 'quiet',
        '-i', filepath,
        '-f', 's16le', '-ac', '1', '-ar', '8000',
        tmppath
    ], check=True)

    with open(tmppath, 'rb') as f:
        data = f.read()
    os.unlink(tmppath)

    samples_per_sec = 8000
    num_samples = len(data) // 2
    samples = struct.unpack(f'<{num_samples}h', data[:num_samples * 2])

    # Compute RMS energy per second
    energies = []
    for i in range(0, num_samples, samples_per_sec):
        chunk = samples[i:i + samples_per_sec]
        if len(chunk) < samples_per_sec // 2:
            break
        rms = (sum(s * s for s in chunk) / len(chunk)) ** 0.5
        energies.append(rms)

    if not energies:
        return 0

    # Find the window with highest total energy
    windows = []
    for i in range(len(energies) - window + 1):
        total = sum(energies[i:i + window])
        windows.append((i, total))

    if not windows:
        return 0

    max_energy = max(w[1] for w in windows)
    threshold = max_energy * 0.85

    # Pick the FIRST window that's within 85% of the loudest (first chorus, not final)
    for start, energy in windows:
        if energy >= threshold:
            return max(0, start - 1)

    return 0

if __name__ == '__main__':
    filepath = sys.argv[1]
    start = find_loudest_window(filepath)
    print(start)
