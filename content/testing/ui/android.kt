class TodoRowTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun tappingTheRowTogglesIt() {
        var toggles = 0
        composeRule.setContent {
            TodoRow(title = "Buy milk", done = false, onToggle = { toggles++ })
        }

        composeRule.onNodeWithText("Buy milk").performClick()

        assertEquals(1, toggles)
    }

    @Test
    fun aDoneRowIsChecked() {
        composeRule.setContent {
            TodoRow(title = "Buy milk", done = true, onToggle = {})
        }

        composeRule.onNode(isToggleable()).assertIsOn()
    }
}
