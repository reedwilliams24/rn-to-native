@Serializable
data class Todo(
    val id: String,
    val title: String,
    val done: Boolean = false,                       // used when the key is missing
    @SerialName("due_date") val dueDate: String? = null,
)

val ApiJson = Json {
    ignoreUnknownKeys = true // a new server field shouldn't crash old app versions
}

fun parseTodos(body: String): List<Todo> = ApiJson.decodeFromString(body)

fun encodeTodo(todo: Todo): String = ApiJson.encodeToString(todo)
