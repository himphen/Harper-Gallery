#!/usr/bin/env bash
set -euo pipefail

mkdir -p artworks

curl -L "https://picsum.photos/seed/gallery-art-1/1200/900" -o artworks/art1.jpg
curl -L "https://picsum.photos/seed/gallery-art-2/1200/900" -o artworks/art2.jpg
curl -L "https://picsum.photos/seed/gallery-art-3/1200/900" -o artworks/art3.jpg
curl -L "https://picsum.photos/seed/gallery-art-4/1200/900" -o artworks/art4.jpg
curl -L "https://picsum.photos/seed/gallery-art-5/1200/900" -o artworks/art5.jpg
curl -L "https://picsum.photos/seed/gallery-art-6/1200/900" -o artworks/art6.jpg
curl -L "https://picsum.photos/seed/gallery-art-7/1200/900" -o artworks/art7.jpg
curl -L "https://picsum.photos/seed/gallery-art-8/1200/900" -o artworks/art8.jpg

echo "Downloaded 8 dummy images into artworks/."
