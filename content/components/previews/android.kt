@Preview(showBackground = true) // @link:open
@Composable // @link:open
private fun TodoRowOpenPreview() { // @link:open
    TodoRow(title = "Buy milk", done = false, onToggle = {}) // @link:open-args
}

@Preview(showBackground = true) // @link:done
@Composable // @link:done
private fun TodoRowDonePreview() { // @link:done
    TodoRow(title = "Buy milk", done = true, onToggle = {}) // @link:done-args
}
