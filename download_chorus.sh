#!/bin/bash
set -e

AUDIO_DIR="public/audio"
TEMP_DIR="public/audio/tmp"
mkdir -p "$AUDIO_DIR" "$TEMP_DIR"

find_chorus_start() {
  local file="$1"
  # Compute RMS volume per second, find the loudest 10s window
  # Output per-second RMS values, then pick the start of the loudest window
  python3 -c "
import subprocess, json, sys

# Get duration
probe = subprocess.run(
    ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '$file'],
    capture_output=True, text=True
)
dur = float(json.loads(probe.stdout)['format']['duration'])
max_start = max(0, int(dur) - 10)

# Compute RMS per 1-second chunk
best_rms = -999
best_start = 0
for t in range(0, max_start + 1):
    result = subprocess.run(
        ['ffmpeg', '-v', 'quiet', '-i', '$file',
         '-ss', str(t), '-t', '1',
         '-af', 'volumedetect', '-f', 'null', '-'],
        capture_output=True, text=True
    )
    for line in result.stderr.split('\n'):
        if 'mean_volume' in line:
            vol = float(line.split('mean_volume:')[1].strip().split(' ')[0])
            if vol > best_rms:
                best_rms = vol
                best_start = t

# Back up a bit so the loud part isn't right at the start (capture lead-in)
start = max(0, best_start - 1)
print(start)
" 2>/dev/null
}

download_chorus() {
  local filename="$1"
  local query="$2"
  local outpath="$AUDIO_DIR/$filename.mp3"
  local tmpfull="$TEMP_DIR/${filename}_full.mp3"

  echo "[$filename] Downloading full track..."

  # Download first 3 minutes
  yt-dlp "ytsearch1:$query" \
    --extract-audio \
    --audio-format mp3 \
    --audio-quality 5 \
    --download-sections "*0:00-3:00" \
    --no-playlist \
    --quiet \
    --no-warnings \
    -o "$TEMP_DIR/${filename}_raw.%(ext)s" 2>/dev/null || {
      echo "[$filename] FAIL: download error"
      return
    }

  local rawfile=$(ls "$TEMP_DIR/${filename}_raw"* 2>/dev/null | head -1)
  if [ -z "$rawfile" ]; then
    echo "[$filename] FAIL: no file"
    return
  fi

  # Convert to consistent format
  ffmpeg -y -i "$rawfile" -ar 44100 -ac 2 -b:a 128k "$tmpfull" 2>/dev/null
  rm -f "$rawfile"

  echo "[$filename] Finding chorus..."
  local chorus_start=$(find_chorus_start "$tmpfull")
  echo "[$filename] Chorus starts at ${chorus_start}s"

  # Extract 10s from chorus with fade-out
  ffmpeg -y -i "$tmpfull" -ss "$chorus_start" -t 10 \
    -af "afade=t=out:st=9:d=1" -b:a 128k -ar 44100 -ac 2 \
    "$outpath" 2>/dev/null

  rm -f "$tmpfull"
  echo "[$filename] OK (chorus @ ${chorus_start}s)"
}

download_chorus "goblin" "Stay With Me Chanyeol Punch Goblin OST official"
download_chorus "crash-landing" "Flower Yoon Mirae Crash Landing on You OST"
download_chorus "descendants" "Always Yoon Mirae Descendants of the Sun OST"
download_chorus "my-love-star" "My Destiny Lyn My Love from the Star OST"
download_chorus "itaewon-class" "Gaho Start Itaewon Class official audio"
download_chorus "hotel-del-luna" "Another Day Monday Kiz Punch Hotel Del Luna OST"
download_chorus "reply-1988" "A Little Girl Oh Hyuk Reply 1988 OST"
download_chorus "its-okay" "Breath Sam Kim Its Okay to Not Be Okay OST"
download_chorus "vincenzo" "Adrenaline Solar Vincenzo OST"
download_chorus "hospital-playlist" "Aloha Jo Jung Suk Hospital Playlist OST"
download_chorus "start-up" "Running Gaho Start Up OST"
download_chorus "true-beauty" "Love So Fine Cha Eunwoo True Beauty OST"
download_chorus "business-proposal" "Love Maybe Kim Sejeong Business Proposal OST"
download_chorus "attorney-woo" "Beyond My Dreams Jeon Mido Extraordinary Attorney Woo OST"
download_chorus "2521" "Starlight Taeil NCT Twenty Five Twenty One OST"
download_chorus "hometown-cha" "Romantic Sunday Car the Garden Hometown Cha Cha Cha OST"
download_chorus "boys-over-flowers" "T-Max Almost Paradise Boys Over Flowers Korean drama"
download_chorus "the-heirs" "Love Is Park Jang Hyun Park Hyun Gyu The Heirs OST"
download_chorus "scarlet-heart" "For You EXO CBX Scarlet Heart Ryeo OST"
download_chorus "strong-woman" "You Are My Garden Jeong Eunji Strong Woman Do Bong Soon OST"
download_chorus "weightlifting-fairy" "From Now On Kim Chungha Weightlifting Fairy Kim Bok Joo OST"
download_chorus "sky-castle" "We All Lie Ha Jin SKY Castle OST"
download_chorus "while-you-slept" "Its You Henry Lau While You Were Sleeping OST"
download_chorus "mr-sunshine" "And Im Here Kim Feel Mr Sunshine OST"
download_chorus "queen-of-tears" "Love You With All My Heart Crush Queen of Tears OST"
download_chorus "alchemy-of-souls" "Light Me Up Hwang Chi Yeul Alchemy of Souls OST"
download_chorus "my-mister" "Adult Sondia My Mister OST"
download_chorus "squid-game" "Way Back Then Jung Jaeil Squid Game OST"
download_chorus "love-alarm" "Motte Love Alarm Korean drama OST"
download_chorus "extraordinary-you" "At a Distance MJ ASTRO Extraordinary You OST"

rm -rf "$TEMP_DIR"

echo ""
echo "Done! $(ls -1 $AUDIO_DIR/*.mp3 2>/dev/null | wc -l | tr -d ' ') / 30 chorus clips ready."
