// src/androidTest/java/.../AddTodoTest.kt (runs on a device or emulator)
class AddTodoTest {
    @get:Rule
    val composeRule = createAndroidComposeRule<MainActivity>()

    @Test
    fun addingATodoShowsItInTheList() {
        composeRule.onNodeWithTag("new-todo-input").performTextInput("Buy milk")
        composeRule.onNodeWithTag("add-todo").performClick()

        composeRule.onNodeWithText("Buy milk").assertIsDisplayed()
    }
}

// In the app
@Composable
fun NewTodoField(value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier.testTag("new-todo-input"),
    )
}
