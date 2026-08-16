# IRONFORGE — installing on a phone

Three ways to get this onto a phone. Pick by device:

| | Android | iPhone |
|---|---|---|
| **Recommended** | APK via GitHub Actions | Home-screen install via GitHub Pages |
| Also works | Home-screen install | Unsigned IPA + AltStore (expires weekly) |

The app itself is one file, `www/index.html`. Everything else here is packaging.

---

## Android — build an APK

Needs nothing installed on your machine; GitHub compiles it.

1. Push this folder to a GitHub repo (private is fine).
2. **Actions** tab → **Build APK** → **Run workflow**. Takes about 5 minutes.
3. Open the finished run, download the **ironforge-apk** artifact, unzip it to get `app-debug.apk`.
4. Move it to the phone, tap it, allow "install unknown apps" for whichever app you opened it from, install.

Debug-signed, so it installs on your own phone and on friends' phones, but Google Play won't take it.

## iPhone — home-screen install

Apple requires every native app to be code-signed, so there's no equivalent of just tapping an APK. The web-app route sidesteps that entirely and produces something that looks and behaves like a normal app: own icon, full screen, no Safari chrome, works offline.

1. In your repo: **Settings** → **Pages** → under Source pick **GitHub Actions**.
2. **Actions** tab → **Publish web app** → **Run workflow**.
3. When it finishes, the run's summary shows your URL, something like `https://yourname.github.io/ironforge/`.
4. Open that URL **in Safari** on the iPhone. Not Chrome — only Safari can install to the home screen.
5. Share button (the square with the up arrow) → scroll → **Add to Home Screen** → **Add**.

Launch it from the icon and it opens standalone. No expiry, no certificate, no computer needed after the first setup.

Same steps work on Android in Chrome if you'd rather skip the APK.

## iPhone — unsigned IPA (advanced, mostly not worth it)

The **Build IPA** workflow exists but is manual-trigger only. It produces an unsigned `.ipa` that a stock iPhone will refuse. To use it you need [AltStore](https://altstore.io) or SideStore, which re-signs it with your free Apple ID — and Apple expires free-signed apps after **7 days**, so it needs refreshing weekly from a computer on the same network. A paid Apple Developer account ($99/year) extends that to a year.

It also runs on a macOS runner, which consumes GitHub Actions minutes 10x faster than Linux.

Unless you specifically need native APIs, the home-screen install is better in every way that matters here.

---

## Things worth knowing

**Each install has its own data.** Browser, home-screen app, and APK are three separate storage buckets. Moving between them means exporting from Settings and importing on the other side.

**Back up occasionally.** Data lives on the device. Clearing app storage, deleting the home-screen icon on iOS, or wiping the phone loses it. Settings has an export button.

**Your API key stays on the device.** It talks straight to Google/Anthropic/OpenAI. Never paste it into `index.html` — a key committed to a repo gets auto-revoked.

**Updating.** Edit `www/index.html` in the repo and commit. The Pages version updates on next launch. The APK needs rebuilding and reinstalling over the top — that keeps your data as long as `appId` in `capacitor.config.json` hasn't changed.

**Offline.** `sw.js` caches the app after first load, network-first so you always get the newest version when you have signal. Label scanning needs a connection regardless, since it calls an AI API.
