@Composable
fun Panel(
    title: String,
    content: @Composable () -> Unit,
) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(title, fontWeight = FontWeight.SemiBold)
        content()
    }
}

// Usage: the trailing lambda is the "children"
Panel(title = "Today") {
    Text("Buy milk")
    Text("Walk the dog")
}
