// Paparazzi renders composables to PNGs on the JVM. No emulator needed.
// ./gradlew recordPaparazziDebug  → writes golden images
// ./gradlew verifyPaparazziDebug  → fails on any pixel diff
class TodoRowScreenshotTest {
    @get:Rule
    val paparazzi = Paparazzi(deviceConfig = DeviceConfig.PIXEL_5)

    @Test
    fun open() {
        paparazzi.snapshot {
            MaterialTheme { TodoRow(title = "Buy milk", done = false, onToggle = {}) }
        }
    }

    @Test
    fun doneDark() {
        paparazzi.snapshot {
            MaterialTheme(colorScheme = darkColorScheme()) {
                Surface { TodoRow(title = "Buy milk", done = true, onToggle = {}) }
            }
        }
    }
}
