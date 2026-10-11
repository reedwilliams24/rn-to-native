// Paparazzi renders composables to PNGs on the JVM. No emulator needed. // @link:lib
// ./gradlew recordPaparazziDebug  → writes golden images
// ./gradlew verifyPaparazziDebug  → fails on any pixel diff
class TodoRowScreenshotTest { // @link:suite
    @get:Rule
    val paparazzi = Paparazzi(deviceConfig = DeviceConfig.PIXEL_5) // @link:lib

    @Test
    fun open() { // @link:open
        paparazzi.snapshot { // @link:snap
            MaterialTheme { TodoRow(title = "Buy milk", done = false, onToggle = {}) } // @link:open-row
        }
    }

    @Test
    fun doneDark() { // @link:done
        paparazzi.snapshot { // @link:snap
            MaterialTheme(colorScheme = darkColorScheme()) {
                Surface { TodoRow(title = "Buy milk", done = true, onToggle = {}) } // @link:done-row
            }
        }
    }
}
