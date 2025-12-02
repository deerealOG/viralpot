---
description: Build and Run Mobile App
---

# How to Build and Run the Mobile App (Android)

Since you are on Windows, you can build and run the Android version of your app.

## Prerequisites
1. **Android Studio**: You must have Android Studio installed. [Download here](https://developer.android.com/studio).
2. **Java Development Kit (JDK)**: Usually included with Android Studio.

## Steps to Run on Android Emulator or Device

1. **Sync Changes**:
   Whenever you make changes to your React code, run:
   ```bash
   npm run build
   npx cap sync
   ```

2. **Open in Android Studio**:
   Run the following command to open the native project:
   ```bash
   npx cap open android
   ```

3. **Run the App**:
   - In Android Studio, wait for Gradle sync to finish.
   - Select an emulator (e.g., Pixel 4) or connect your physical Android device via USB (enable USB Debugging).
   - Click the green "Play" (Run) button in the top toolbar.

## Troubleshooting
- If you see "SDK location not found", create a `local.properties` file in the `android` folder with the path to your Android SDK:
  ```
  sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
  ```
