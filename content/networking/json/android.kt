@Serializable // @link:model
data class Todo( // @link:model
    val id: String, // @link:id
    val title: String, // @link:title
    val done: Boolean = false,                       // used when the key is missing // @link:done
    @SerialName("due_date") val dueDate: String? = null, // @link:due
)

val ApiJson = Json { // @link:config
    ignoreUnknownKeys = true // a new server field shouldn't crash old app versions // @link:config
}

fun parseTodos(body: String): List<Todo> = ApiJson.decodeFromString(body) // @link:parse

fun encodeTodo(todo: Todo): String = ApiJson.encodeToString(todo)
