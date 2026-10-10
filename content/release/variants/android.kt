// app/build.gradle.kts
android {
    namespace = "com.acme.todos"

    defaultConfig {
        applicationId = "com.acme.todos"
        versionCode = 42
        versionName = "1.4.0"
    }

    buildFeatures { buildConfig = true }

    flavorDimensions += "environment"
    productFlavors {
        create("staging") {
            dimension = "environment"
            applicationIdSuffix = ".staging"
            resValue("string", "app_name", "Todos (staging)")
            buildConfigField("String", "API_URL", "\"https://staging.api.acme.com\"")
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

// Read it at runtime (generated per variant): BuildConfig.API_URL, BuildConfig.DEBUG
