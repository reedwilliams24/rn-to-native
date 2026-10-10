@Composable
fun TodoStatus(
    done: Boolean,
    dueDate: String? = null,
) {
    Column {
        if (done) Text("Done") else Text("Open")

        if (dueDate != null) {
            Text("Due $dueDate")
        }
    }
}
