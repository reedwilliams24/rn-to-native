// MainActivity.kt
// AndroidManifest.xml marks it as the launcher
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        // Hand Compose the root UI
        setContent {
            TodoTheme {
                TodoScreen()
            }
        }
    }
}
