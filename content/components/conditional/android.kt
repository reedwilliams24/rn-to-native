@Composable // @link:fn
fun TodoStatus( // @link:fn,props
    done: Boolean, // @link:done
    dueDate: String? = null, // @link:due
) {
    Column { // @link:column
        if (done) Text("Done") else Text("Open") // @link:if-else

        if (dueDate != null) { // @link:optional
            Text("Due $dueDate") // @link:optional
        }
    }
}
