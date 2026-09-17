# Landing page — CoopCycle Courier (POC)

A static page for handing the Android build to testers. No build step, no
dependencies to install: serve the folder and you are done.

## Adding the APK

Drop the build in here as `coopcycle-courier.apk`:

```
html/coopcycle-courier.apk
```

That is the only step. The page reads the file's size and date from the server
and shows them under the download button. Until the file exists, the button
greys out and says the build is not published yet — no broken download.

Using a different filename or hosting the APK elsewhere? Change `APK_FILE` at
the top of `assets/app.js`.

## Adding screenshots

Three portrait slots, in `screenshots/`:

| File                      | Caption shown            |
| ------------------------- | ------------------------ |
| `screenshots/01-tasks.png` | Tasks for the day        |
| `screenshots/02-map.png`   | Map and navigation       |
| `screenshots/03-proof.png` | Proof of delivery        |

Any missing file falls back to a dashed "Screenshot coming soon" placeholder,
so the layout never breaks. Portrait phone screenshots fit best (the ones in here are 720x1520,
downscaled from a 1440x3040 device); anything else is cropped to 9:19.

## Serving it

Anything that serves static files works:

```bash
python3 -m http.server 8000 --directory html
```

If your server needs to be told about APKs, the MIME type is
`application/vnd.android.package-archive`. Serve the page over HTTPS —
Chrome on Android blocks APK downloads from insecure origins.

## What's in here

```
index.html          the page
assets/style.css    styles (light + dark, CoopCycle black/white/red)
assets/app.js       QR code + APK availability check
assets/logo.svg     CoopCycle mark, used as the favicon
vendor/qrcode.js    qrcode-generator 1.4.4 by Kazuhiko Arase (MIT), vendored
                    so the page has no CDN dependency and works offline
screenshots/        your screenshots go here
```

The QR code encodes the page's own URL — a courier scans it from a laptop
screen and lands on the install instructions on their phone. It is generated
in the browser, so it always matches wherever you host this.

The page is marked `noindex`: it is a POC build for testers, not something
that should turn up in search results.
