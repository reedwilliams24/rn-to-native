class TodoRowTest { // @link:suite
    @get:Rule
    val composeRule = createComposeRule() // @link:lib

    @Test
    fun tappingTheRowTogglesIt() { // @link:tap-test
        var toggles = 0 // @link:counter
        composeRule.setContent {
            TodoRow(title = "Buy milk", done = false, onToggle = { toggles++ }) // @link:render
        }

        composeRule.onNodeWithText("Buy milk").performClick() // @link:tap

        assertEquals(1, toggles) // @link:assert
    }

    @Test
    fun aDoneRowIsChecked() { // @link:done-test
        composeRule.setContent {
            TodoRow(title = "Buy milk", done = true, onToggle = {}) // @link:done-render
        }

        composeRule.onNode(isToggleable()).assertIsOn() // @link:done-assert
    }
}
