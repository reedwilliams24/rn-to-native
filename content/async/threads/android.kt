class ExportViewModel(private val dir: File) : ViewModel() { // @link:model
    private val _status = MutableStateFlow("Idle") // @link:state
    val status: StateFlow<String> = _status.asStateFlow()

    fun export(todos: List<Todo>) { // @link:fn
        viewModelScope.launch {                       // starts on Dispatchers.Main // @link:thread
            _status.value = "Exporting…" // @link:status1
            val file = withContext(Dispatchers.IO) {  // hop to a background pool // @link:thread,bg
                File(dir, "todos.csv").apply { // @link:file
                    writeText(todos.joinToString("\n") { "${it.id},${it.title},${it.done}" }) // @link:write,csv
                }
            }
            _status.value = "Saved ${file.name}"      // back on Main automatically // @link:status2
        }
    }
}
