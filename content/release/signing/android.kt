// app/build.gradle.kts: the upload key comes from CI secrets, never from git
android {
    signingConfigs {
        create("upload") {
            storeFile = file(System.getenv("UPLOAD_KEYSTORE_PATH") ?: "upload.jks")
            storePassword = System.getenv("UPLOAD_KEYSTORE_PASSWORD")
            keyAlias = System.getenv("UPLOAD_KEY_ALIAS")
            keyPassword = System.getenv("UPLOAD_KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("upload")
        }
    }
}

// Create the upload key once, then back it up somewhere safe:
//   keytool -genkeypair -v -keystore upload.jks -alias upload \
//     -keyalg RSA -keysize 2048 -validity 10000
//
// Build the signed bundle for Play:
//   ./gradlew :app:bundleProductionRelease
