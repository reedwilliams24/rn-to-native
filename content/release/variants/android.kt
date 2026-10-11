// app/build.gradle.kts
android {
    namespace = "com.acme.todos"

    defaultConfig {
        applicationId = "com.acme.todos" // @link:bundle-id
        versionCode = 42 // @link:build
        versionName = "1.4.0" // @link:version
    }

    buildFeatures { buildConfig = true }

    flavorDimensions += "environment"
    productFlavors { // @link:variant
        create("staging") { // @link:variant
            dimension = "environment"
            applicationIdSuffix = ".staging" // @link:bundle-id
            resValue("string", "app_name", "Todos (staging)") // @link:name
            buildConfigField("String", "API_URL", "\"https://staging.api.acme.com\"") // @link:api
        }
        create("production") {
            dimension = "environment"
            resValue("string", "app_name", "Todos")
            buildConfigField("String", "API_URL", "\"https://api.acme.com\"")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

// Read it at runtime (generated per variant): BuildConfig.API_URL, BuildConfig.DEBUG // @link:read
