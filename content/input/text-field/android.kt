@Composable
fun NameField() { // @link:fn
    var name by rememberSaveable { mutableStateOf("") } // @link:state

    OutlinedTextField( // @link:field
        value = name, // @link:value
        onValueChange = { name = it }, // skip this and typing does nothing // @link:change
        label = { Text("Name") }, // @link:label
        singleLine = true,
    )
}
