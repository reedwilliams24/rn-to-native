class ExportViewModel(private val dir: File) : ViewModel() {
    private val _status = MutableStateFlow("Idle")
    val status: StateFlow<String> = _status.asStateFlow()

    fun export(todos: List<Todo>) {
        viewModelScope.launch {                       // starts on Dispatchers.Main
            _status.value = "Exporting…"
            val file = withContext(Dispatchers.IO) {  // hop to a background pool
                File(dir, "todos.csv").apply {
                    writeText(todos.joinToString("\n") { "${it.id},${it.title},${it.done}" })
                }
            }
            _status.value = "Saved ${file.name}"      // back on Main automatically
        }
    }
}
