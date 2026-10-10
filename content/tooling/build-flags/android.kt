// app/build.gradle.kts
android {
    // Off by default since AGP 8
    buildFeatures { buildConfig = true }
    buildTypes {
        debug {
            buildConfigField(
                "String", "API_URL",
                "\"http://10.0.2.2:3000\"",
            )
        }
        release {
            buildConfigField(
                "String", "API_URL",
                "\"https://api.example.com\"",
            )
        }
    }
}

// Anywhere in app code: a generated, typed constant
val apiUrl = BuildConfig.API_URL

fun logConfig() {
    if (BuildConfig.DEBUG) {
        Log.d("Config", "Using API $apiUrl")
    }
}
