// filesDir: kept until uninstall. cacheDir: the system may clear it when space is low.
suspend fun exportTodos(context: Context, todos: List<Todo>): File =
    withContext(Dispatchers.IO) {
        File(context.filesDir, "export.json").apply {
            writeText(Json.encodeToString(todos))
        }
    }

suspend fun cacheThumbnail(context: Context, id: String, bytes: ByteArray): File =
    withContext(Dispatchers.IO) {
        File(context.cacheDir, "thumb-$id.jpg").apply { writeBytes(bytes) }
    }
