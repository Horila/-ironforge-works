# IRONFORGE — Android build

This wraps the single-file app (`www/index.html`) in a Capacitor shell so Android can install it as a real app: own icon in the launcher, no browser bars, own storage.

There is no APK in this folder. An APK has to be compiled, and the build needs Google's Android SDK. The workflow below does that for you on GitHub's servers, for free, without installing anything on your machine.

## Get an APK without installing anything

1. Create a new **private** repository on GitHub.
2. Upload everything in this folder to it, keeping the structure (`.github/workflows/android.yml` must stay in that path — if you drag files into GitHub's web uploader, dotfolders are preserved).
3. Go to the **Actions** tab. If it asks you to enable workflows, enable them.
4. Pick **Build APK** → **Run workflow**. It takes roughly 5 minutes the first time.
5. Open the finished run and download the **ironforge-apk** artifact. Unzip it to get `app-debug.apk`.
6. Copy the APK to your phone and open it. Android will warn about installing from an unknown source — allow it for your file manager, then install.

Every push to `main` rebuilds it, so to update the app you edit `www/index.html`, push, and download the new APK.

## Build it locally instead

Needs Node 22+, JDK 21, and Android Studio (for the SDK).

```bash
npm install
npx cap add android
npx capacitor-assets generate --android
npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK lands in `android/app/build/outputs/apk/debug/app-debug.apk`. Or run `npx cap open android` and hit Run in Android Studio.

## Things worth knowing

**It's a debug build.** Signed with Android's throwaway debug key, which is fine for installing on your own phone and sharing with friends. Google Play won't accept it. For Play you'd generate a keystore and switch the last step to `assembleRelease` with signing config — a different job, ask when you get there.

**The scan button opens the camera.** The app detects it's running natively and asks the WebView for a camera capture; the 🖼 button next to it picks an existing photo. No camera permission is declared, so Android hands off to your normal camera app and you get no permission prompt.

**Your data lives inside the app.** Same localStorage as the browser version, but a separate copy — the app starts empty even if your browser version has history. Clearing the app's storage in Android settings wipes it, so use the export button in Settings occasionally.

**API keys still work the same way.** The key sits in the app's storage and talks directly to Google/Anthropic/OpenAI. Nothing goes through a server of mine or anyone else's.

**Changing the app name or ID.** Edit `capacitor.config.json` before the first build. `appId` is permanent-ish: change it later and Android treats it as a different app, installing alongside the old one instead of updating it.
