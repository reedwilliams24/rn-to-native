@Composable
fun SearchScreen() { // @link:fn
    // remember { } would reset on rotation, because the Activity is recreated. // @link:rotation
    // rememberSaveable writes to the saved-instance Bundle, so it survives
    // rotation *and* the system killing the app in the background.
    var query by rememberSaveable { mutableStateOf("") } // @link:state

    TextField( // @link:field
        value = query, // @link:field
        onValueChange = { query = it }, // @link:field
        placeholder = { Text("Search") }, // @link:field
    )
}
