# Brescia on Foot

A hand-picked, mobile-friendly walking guide to Brescia for people who walk a lot, prefer quiet places to famous ones, and want local food without sitting in restaurants.

## What's in it

- **29 picks** (`js/picks.mjs`): quiet sights (the rivers under the city, a frescoed "Sistine Chapel", a hidden courtyard, a Titian still on its altar…), outdoors, and food shops and markets. Each has an opinion ("My take"), practical cautions (hours etc.) and **links to the sources that back it up** (checked October 2026). Picks with old or incomplete evidence are marked *Check before you go*.
- **4 walks** that string picks together (from a 1 km art walk to a full-day hike up Monte Maddalena), each with when to go and why, routed along real streets, with a GPX download and a one-tap Google Maps walking route.
- Optional OpenStreetMap extras: **CAI hiking trails** (with GPX) and **drinking fountains / WC**.
- Live location, distances, a "my walk" planner, search, shareable links, and offline use after the first visit.

No coordinates are typed in by hand. `scripts/locate.mjs` finds each pick in OpenStreetMap (Nominatim) by its lookup query, or falls back to its verified address, and prints which OpenStreetMap object it matched so mistakes are easy to spot. Picks it can't place still appear in the list with their address.

### Editing the guide

Add or change entries in `js/picks.mjs`. A pick needs `why`, at least one `evidence` link, a `confidence`, and lookup queries in `find.q`. Then run `node scripts/locate.mjs`, check its log, and commit `data/`. CI fails if `data/` is out of step with `js/picks.mjs`.

## Deploying to GitHub Pages

The site is plain static files, and the generated `data/` folder is committed. GitHub Pages serves it straight from the branch (**Settings → Pages → Deploy from a branch**, branch `claude/brescia-travel-guide-app-7yIFz`, folder `/`). There is no build step.

To refresh the data (new picks, changed trails, more fountains):

```bash
node scripts/locate.mjs      # ~3 minutes; needs internet
git add data && git commit -m "Refresh data" && git push
```

The `Tests` workflow runs the unit tests and checks that `data/` matches the guide.

## Local development

```bash
node --test test/*.test.mjs                     # unit tests
node scripts/locate.mjs                         # regenerate data/ (needs internet)
npx http-server .                               # open http://localhost:8080
node scripts/build.mjs --fixtures test/fixtures # test build with synthetic data into _site/
```

The files in `test/fixtures/` are made up (all names start with `TEST`) and are used only by the tests.

## Project layout

```
index.html, styles.css, js/app.js   the app
sw.js, manifest.webmanifest, icons/ offline support and installability
js/picks.mjs                        the guide: picks, walks, lookup and routing helpers
js/osm.mjs                          OpenStreetMap extras (trails, water, WC)
scripts/locate.mjs                  generates data/ (picks located, walks routed, trails, water/WC)
scripts/check-data.mjs              CI check that data/ matches js/picks.mjs
scripts/build.mjs                   test build from fixtures (or Overpass) into _site/
data/                               generated, committed
vendor/                             Leaflet 1.9.4 and Leaflet.markercluster 1.5.3 (bundled, so no CDN is needed)
.github/workflows/deploy.yml        tests, build and Pages deployment
```

## Data and licences

Map data and tiles © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright). Geocoding by Nominatim, walking routes by the FOSSGIS OSRM server, trail data via [Waymarked Trails](https://hiking.waymarkedtrails.org/). Leaflet and Leaflet.markercluster are BSD-2 and MIT licensed (see `vendor/`).
