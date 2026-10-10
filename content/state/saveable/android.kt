@Composable
fun SearchScreen() {
    // remember { } would reset on rotation, because the Activity is recreated.
    // rememberSaveable writes to the saved-instance Bundle, so it survives
    // rotation *and* the system killing the app in the background.
    var query by rememberSaveable { mutableStateOf("") }

    TextField(
        value = query,
        onValueChange = { query = it },
        placeholder = { Text("Search") },
    )
}
