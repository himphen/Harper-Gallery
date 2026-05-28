#!/usr/bin/env bash
set -euo pipefail

mkdir -p artworks

download_image() {
  local seed="$1"
  local output="$2"
  curl --fail --show-error --silent --location \
    "https://picsum.photos/seed/${seed}/1200/900" \
    --output "${output}"
}

download_image "gallery-art-1" "artworks/art1.jpg"
download_image "gallery-art-2" "artworks/art2.jpg"
download_image "gallery-art-3" "artworks/art3.jpg"
download_image "gallery-art-4" "artworks/art4.jpg"
download_image "gallery-art-5" "artworks/art5.jpg"
download_image "gallery-art-6" "artworks/art6.jpg"
download_image "gallery-art-7" "artworks/art7.jpg"
download_image "gallery-art-8" "artworks/art8.jpg"

echo "Downloaded 8 dummy images into artworks/."
