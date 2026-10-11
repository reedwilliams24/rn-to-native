// shared/src/commonMain/kotlin/TodoRules.kt (Kotlin Multiplatform module) // @link:shared
object TodoRules {
    const val MAX_TITLE = 120 // @link:max

    fun validateTitle(title: String): String? { // @link:validate
        val trimmed = title.trim() // @link:trim
        return when {
            trimmed.isEmpty() -> "Title is required" // @link:empty
            trimmed.length > MAX_TITLE -> "Keep it under $MAX_TITLE characters" // @link:long
            else -> null // @link:ok
        }
    }
}

// app/: Android uses it like any other Kotlin code
@Composable
fun TitleField(title: String, onTitleChange: (String) -> Unit) {
    val error = TodoRules.validateTitle(title) // @link:use
    OutlinedTextField( // @link:field
        value = title,
        onValueChange = onTitleChange,
        isError = error != null,
        supportingText = { error?.let { Text(it) } }, // @link:showerr
    )
}
