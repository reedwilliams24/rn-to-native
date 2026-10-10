// shared/src/commonMain/kotlin/TodoRules.kt (Kotlin Multiplatform module)
object TodoRules {
    const val MAX_TITLE = 120

    fun validateTitle(title: String): String? {
        val trimmed = title.trim()
        return when {
            trimmed.isEmpty() -> "Title is required"
            trimmed.length > MAX_TITLE -> "Keep it under $MAX_TITLE characters"
            else -> null
        }
    }
}

// app/: Android uses it like any other Kotlin code
@Composable
fun TitleField(title: String, onTitleChange: (String) -> Unit) {
    val error = TodoRules.validateTitle(title)
    OutlinedTextField(
        value = title,
        onValueChange = onTitleChange,
        isError = error != null,
        supportingText = { error?.let { Text(it) } },
    )
}
