// MainActivity.kt // @link:entry
// AndroidManifest.xml marks it as the launcher // @link:register
class MainActivity : ComponentActivity() { // @link:entry
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        // Hand Compose the root UI
        setContent { // @link:root
            TodoTheme { // @link:theme
                TodoScreen() // @link:screen
            }
        }
    }
}
