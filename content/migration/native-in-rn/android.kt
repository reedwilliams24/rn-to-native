// modules/native-settings/android/.../NativeSettingsModule.kt (Expo Modules API)
class NativeSettingsModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("NativeSettings")

        AsyncFunction("open") {
            val activity = appContext.currentActivity ?: return@AsyncFunction
            activity.startActivity(Intent(activity, SettingsActivity::class.java))
        }.runOnQueue(Queues.MAIN)
    }
}

// A plain activity hosting the new Compose screen.
// Register it in the module's AndroidManifest.xml.
class SettingsActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme { SettingsScreen(onDone = ::finish) }
        }
    }
}
