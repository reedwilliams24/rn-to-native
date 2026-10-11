// gradle/libs.versions.toml // @link:file
//
// [versions]
// coil = "3.0.4" // @link:lib
//
// [libraries]
// coil-compose = { module = "io.coil-kt.coil3:coil-compose",
//                  version.ref = "coil" }

// app/build.gradle.kts reads it via `libs`
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

dependencies { // @link:deps
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.coil.compose) // @link:lib
    implementation(libs.coil.network.okhttp)
    // Test-only, like devDependencies // @link:dev
    testImplementation(libs.junit) // @link:dev
}
