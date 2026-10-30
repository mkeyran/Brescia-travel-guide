# Brescia on Foot

A mobile-friendly walking map of Brescia for people who like long walks, local food shops and markets, and the less obvious corners of a city.

**All places and trails come from [OpenStreetMap](https://www.openstreetmap.org/).** None are added by hand. The site is rebuilt every week with fresh data, and each place links to its OpenStreetMap entry so you can check it there or fix it.

## What it shows

| Layer | OpenStreetMap source |
|---|---|
| 🥾 Trails | Hiking and foot route relations (CAI trails etc.), with their real geometry |
| 🧀 Food shops & markets | Bakeries, pasticcerie, cheese shops, delis, greengrocers, butchers, enoteche, pastifici, gelaterie, markets… (no restaurants) |
| 🏛️ Heritage | Named historic features, museums, churches with a Wikidata entry, fountains |
| 🌄 Views & parks | Viewpoints, picnic spots, named parks and nature reserves |
| 🎨 Art | Named artworks: murals, statues, sculptures |
| 🚰 Water & WC | Drinking fountains and public toilets |

## Features

- Trails drawn along their real paths, coloured by CAI difficulty (T / E / EE), with **GPX download** for offline hiking apps
- **Live location**: a blue dot with an accuracy circle; the list sorts by distance from you
- **My walk**: collect stops and open them as a walking route in Google Maps
- Walking directions to any place or to the nearest point of a trail
- Search, category filters, and shareable links (`#node/123`)
- Works offline after the first visit (the app and data are cached, plus any map tiles you have looked at); can be installed on a phone's home screen

## Deploying to GitHub Pages

1. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main` (or to `claude/brescia-travel-guide-app-7yIFz`), or run the **Build and deploy to GitHub Pages** workflow from the **Actions** tab.
3. The workflow runs the tests, downloads the current OpenStreetMap data, builds `_site/` and publishes it at `https://<user>.github.io/Brescia-travel-guide/`.

The workflow also runs every Monday to refresh the data. If the data download fails or returns suspiciously little (fewer than 50 places), the build stops and the site that is already live stays as it is.

If deploying from a non-default branch is rejected, open **Settings → Environments → github-pages** and allow that branch.

## Local development

```bash
node --test test/*.test.mjs                     # unit tests
node scripts/build.mjs                          # fetch live OSM data into _site/ (needs internet)
node scripts/build.mjs --fixtures test/fixtures # or build with synthetic test data
npx http-server _site                           # open http://localhost:8080
```

The files in `test/fixtures/` are made up (all names start with `TEST`) and are used only by the tests.

## Project layout

```
index.html, styles.css, js/app.js   the app
sw.js, manifest.webmanifest, icons/ offline support and installability
scripts/osm.mjs                     Overpass queries and data transforms
scripts/build.mjs                   builds _site/ and fetches the data
vendor/                             Leaflet 1.9.4 and Leaflet.markercluster 1.5.3 (bundled, so no CDN is needed)
.github/workflows/deploy.yml        tests, build and Pages deployment
```

## Data and licences

Map data and tiles © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright). Leaflet and Leaflet.markercluster are BSD-2 and MIT licensed (see `vendor/`).
