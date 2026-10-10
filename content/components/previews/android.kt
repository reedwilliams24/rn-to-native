@Preview(showBackground = true)
@Composable
private fun TodoRowOpenPreview() {
    TodoRow(title = "Buy milk", done = false, onToggle = {})
}

@Preview(showBackground = true)
@Composable
private fun TodoRowDonePreview() {
    TodoRow(title = "Buy milk", done = true, onToggle = {})
}
