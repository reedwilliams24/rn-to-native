// Later the native app is the shell, and the flag picks the legacy RN screen. // @link:shell
interface FeatureFlags {
    fun isEnabled(key: String): Boolean // @link:iface
}

@Serializable
data object SettingsRoute

fun openSettings(context: Context, navController: NavController, flags: FeatureFlags) { // @link:fn
    if (flags.isEnabled("native_settings")) { // @link:check
        navController.navigate(SettingsRoute) // new Compose screen // @link:new
    } else {
        context.startActivity(Intent(context, LegacySettingsActivity::class.java)) // @link:legacy
    }
}

// In the NavHost (Chapter 9)
// composable<SettingsRoute> { SettingsScreen() }
