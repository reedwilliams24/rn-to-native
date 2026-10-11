@Composable // @link:fn
fun Panel( // @link:fn,props
    title: String, // @link:title
    content: @Composable () -> Unit, // @link:slot
) {
    Column(modifier = Modifier.padding(16.dp)) { // @link:container
        Text(title, fontWeight = FontWeight.SemiBold) // @link:heading
        content() // @link:render-slot
    }
}

// Usage: the trailing lambda is the "children"
Panel(title = "Today") { // @link:usage
    Text("Buy milk") // @link:milk
    Text("Walk the dog") // @link:dog
}
