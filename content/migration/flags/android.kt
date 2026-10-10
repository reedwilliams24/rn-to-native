// Later the native app is the shell, and the flag picks the legacy RN screen.
interface FeatureFlags {
    fun isEnabled(key: String): Boolean
}

@Serializable
data object SettingsRoute

fun openSettings(context: Context, navController: NavController, flags: FeatureFlags) {
    if (flags.isEnabled("native_settings")) {
        navController.navigate(SettingsRoute) // new Compose screen
    } else {
        context.startActivity(Intent(context, LegacySettingsActivity::class.java))
    }
}

// In the NavHost (Chapter 9)
// composable<SettingsRoute> { SettingsScreen() }
