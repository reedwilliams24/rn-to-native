// app/build.gradle.kts
android {
    // Off by default since AGP 8
    buildFeatures { buildConfig = true }
    buildTypes {
        debug { // @link:flag
            buildConfigField(
                "String", "API_URL",
                "\"http://10.0.2.2:3000\"", // @link:dev-url
            )
        }
        release {
            buildConfigField(
                "String", "API_URL",
                "\"https://api.example.com\"", // @link:prod-url
            )
        }
    }
}

// Anywhere in app code: a generated, typed constant // @link:generated
val apiUrl = BuildConfig.API_URL // @link:url,generated

fun logConfig() {
    if (BuildConfig.DEBUG) { // @link:debug-check
        Log.d("Config", "Using API $apiUrl") // @link:log
    }
}
