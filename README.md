# Brescia on Foot

A hand-picked, mobile-friendly walking guide to Brescia for people who walk a lot, prefer quiet places to famous ones, and want local food without sitting in restaurants.

## What's in it

- **22 picks** (`js/picks.mjs`): sights, outdoors, and food shops and markets. Each has an opinion ("My take"), practical cautions (hours etc.) and **links to the sources that back it up** (checked October 2026). Picks with old or incomplete evidence are marked *Check before you go*.
- **3 walks** that string picks together, each with when to go and why, routed along real streets, with a GPX download and a one-tap Google Maps walking route.
- Optional OpenStreetMap extras: **CAI hiking trails** (with GPX) and **drinking fountains / WC**.
- Live location, distances, a "my walk" planner, search, shareable links, and offline use after the first visit.

No coordinates are typed in by hand. The build finds each pick in OpenStreetMap by name near a rough hint, or falls back to its verified address, and logs how each one was located. Picks it can't place still appear in the list with their address.

### Editing the guide

Add or change entries in `js/picks.mjs`. A pick needs `why`, at least one `evidence` link, a `confidence`, and a `find` hint. `node --test test/*.test.mjs` checks that every pick is complete and that walks only use existing picks.

## Deploying to GitHub Pages

1. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main` (or to `claude/brescia-travel-guide-app-7yIFz`), or run the **Build and deploy to GitHub Pages** workflow from the **Actions** tab.
3. The workflow runs the tests, downloads the current OpenStreetMap data, builds `_site/` and publishes it at `https://<user>.github.io/Brescia-travel-guide/`.

The workflow also runs every Monday. If fewer than 12 picks can be located, the build stops and the live site stays as it is. The build log lists how each pick was located. If Pages is set to "Deploy from a branch" instead, the app does the lookups in the browser on first visit.

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
js/picks.mjs                        the guide: picks, walks, lookup and routing helpers
js/osm.mjs                          OpenStreetMap extras (trails, water, WC)
scripts/build.mjs                   builds _site/ and fetches the data
vendor/                             Leaflet 1.9.4 and Leaflet.markercluster 1.5.3 (bundled, so no CDN is needed)
.github/workflows/deploy.yml        tests, build and Pages deployment
```

## Data and licences

Map data and tiles © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright). Leaflet and Leaflet.markercluster are BSD-2 and MIT licensed (see `vendor/`).
