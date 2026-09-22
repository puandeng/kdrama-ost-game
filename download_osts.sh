#!/bin/bash
set -e

AUDIO_DIR="public/audio"
mkdir -p "$AUDIO_DIR"

download_ost() {
  local filename="$1"
  local query="$2"
  local outpath="$AUDIO_DIR/$filename.mp3"

  if [ -f "$outpath" ]; then
    echo "SKIP: $filename already exists"
    return
  fi

  echo "Downloading: $filename ($query)"

  # Download audio, trim to first 15s (buffer), convert to mp3
  yt-dlp "ytsearch1:$query" \
    --extract-audio \
    --audio-format mp3 \
    --audio-quality 5 \
    --download-sections "*0:00-0:15" \
    --no-playlist \
    --quiet \
    --no-warnings \
    -o "$AUDIO_DIR/${filename}_tmp.%(ext)s" 2>/dev/null || {
      echo "FAIL: $filename - yt-dlp error"
      return
    }

  # Find the downloaded file and trim to exactly 10s with fade
  local tmpfile=$(ls "$AUDIO_DIR/${filename}_tmp"* 2>/dev/null | head -1)
  if [ -z "$tmpfile" ]; then
    echo "FAIL: $filename - no file downloaded"
    return
  fi

  ffmpeg -y -i "$tmpfile" -t 10 -af "afade=t=out:st=9:d=1" -b:a 128k "$outpath" 2>/dev/null
  rm -f "$tmpfile"
  echo "OK: $filename"
}

download_ost "goblin" "Stay With Me Chanyeol Punch Goblin OST official"
download_ost "crash-landing" "Flower Yoon Mirae Crash Landing on You OST"
download_ost "descendants" "Always Yoon Mirae Descendants of the Sun OST"
download_ost "my-love-star" "My Destiny Lyn My Love from the Star OST"
download_ost "itaewon-class" "Start Gaho Itaewon Class OST"
download_ost "hotel-del-luna" "Another Day Monday Kiz Punch Hotel Del Luna OST"
download_ost "reply-1988" "A Little Girl Oh Hyuk Reply 1988 OST"
download_ost "its-okay" "Breath Sam Kim Its Okay to Not Be Okay OST"
download_ost "vincenzo" "Adrenaline Solar Vincenzo OST"
download_ost "hospital-playlist" "Aloha Jo Jung Suk Hospital Playlist OST"
download_ost "start-up" "Running Gaho Start Up OST"
download_ost "true-beauty" "Love So Fine Cha Eunwoo True Beauty OST"
download_ost "business-proposal" "Love Maybe Kim Sejeong Business Proposal OST"
download_ost "attorney-woo" "Beyond My Dreams Jeon Mido Extraordinary Attorney Woo OST"
download_ost "2521" "Starlight Taeil NCT Twenty Five Twenty One OST"
download_ost "hometown-cha" "Romantic Sunday Car the Garden Hometown Cha Cha Cha OST"
download_ost "boys-over-flowers" "Almost Paradise T-Max Boys Over Flowers OST"
download_ost "the-heirs" "Love Is Park Jang Hyun Park Hyun Gyu The Heirs OST"
download_ost "scarlet-heart" "For You EXO CBX Scarlet Heart Ryeo OST"
download_ost "strong-woman" "You Are My Garden Jeong Eunji Strong Woman Do Bong Soon OST"
download_ost "weightlifting-fairy" "From Now On Kim Chungha Weightlifting Fairy Kim Bok Joo OST"
download_ost "sky-castle" "We All Lie Ha Jin SKY Castle OST"
download_ost "while-you-slept" "Its You Henry Lau While You Were Sleeping OST"
download_ost "mr-sunshine" "And Im Here Kim Feel Mr Sunshine OST"
download_ost "queen-of-tears" "Love You With All My Heart Crush Queen of Tears OST"
download_ost "alchemy-of-souls" "Light Me Up Hwang Chi Yeul Alchemy of Souls OST"
download_ost "my-mister" "Adult Sondia My Mister OST"
download_ost "squid-game" "Way Back Then Jung Jaeil Squid Game OST"
download_ost "love-alarm" "Love Alarm Motte Love Alarm OST"
download_ost "extraordinary-you" "At a Distance MJ ASTRO Extraordinary You OST"

echo ""
echo "Done! $(ls -1 $AUDIO_DIR/*.mp3 2>/dev/null | wc -l | tr -d ' ') / 30 clips downloaded."
