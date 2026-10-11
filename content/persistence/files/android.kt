// filesDir: kept until uninstall. cacheDir: the system may clear it when space is low. // @link:dirs
suspend fun exportTodos(context: Context, todos: List<Todo>): File = // @link:export
    withContext(Dispatchers.IO) {
        File(context.filesDir, "export.json").apply { // @link:exportpath
            writeText(Json.encodeToString(todos)) // @link:exportwrite
        }
    }

suspend fun cacheThumbnail(context: Context, id: String, bytes: ByteArray): File = // @link:cache
    withContext(Dispatchers.IO) {
        File(context.cacheDir, "thumb-$id.jpg").apply { writeBytes(bytes) } // @link:cachepath,cachewrite
    }
