// gradle/libs.versions.toml
//
// [versions]
// coil = "3.0.4"
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

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.coil.compose)
    implementation(libs.coil.network.okhttp)
    // Test-only, like devDependencies
    testImplementation(libs.junit)
}
