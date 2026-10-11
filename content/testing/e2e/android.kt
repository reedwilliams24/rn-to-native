// src/androidTest/java/.../AddTodoTest.kt (runs on a device or emulator) // @link:file
class AddTodoTest { // @link:suite
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>() // @link:launch

    @Test
    fun addingATodoShowsItInTheList() { // @link:test
        composeRule.onNodeWithTag("new-todo-input").performTextInput("Buy milk") // @link:type
        composeRule.onNodeWithTag("add-todo").performClick() // @link:tap

        composeRule.onNodeWithText("Buy milk").assertIsDisplayed() // @link:assert
    }
}

// In the app
@Composable
fun NewTodoField(value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.testTag("new-todo-input"), // @link:tag
    )
}
