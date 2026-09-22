#!/bin/bash
set -e

AUDIO_DIR="public/audio"
TEMP_DIR="public/audio/tmp"
mkdir -p "$AUDIO_DIR" "$TEMP_DIR"

download_chorus() {
  local filename="$1"
  local query="$2"
  local outpath="$AUDIO_DIR/$filename.mp3"

  echo -n "[$filename] downloading... "

  yt-dlp "ytsearch1:$query" \
    --extract-audio --audio-format mp3 --audio-quality 5 \
    --no-playlist --quiet --no-warnings \
    -o "$TEMP_DIR/${filename}_full.%(ext)s" 2>/dev/null || {
      echo "FAIL (download)"
      return
    }

  local fullfile=$(ls "$TEMP_DIR/${filename}_full"* 2>/dev/null | head -1)
  if [ -z "$fullfile" ]; then
    echo "FAIL (no file)"
    return
  fi

  echo -n "analyzing... "
  local chorus=$(python3 find_chorus.py "$fullfile")

  # -ss BEFORE -i for proper input seeking
  ffmpeg -y -ss "$chorus" -i "$fullfile" -t 10 \
    -af "afade=t=out:st=9:d=1" -b:a 128k -ar 44100 -ac 2 \
    "$outpath" 2>/dev/null

  rm -f "$fullfile"

  # Verify volume
  local vol=$(ffmpeg -i "$outpath" -af volumedetect -f null - 2>&1 | grep max_volume | awk '{print $5}')
  echo "OK (chorus @ ${chorus}s, vol: ${vol}dB)"
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
