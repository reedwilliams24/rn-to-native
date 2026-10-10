@Composable
fun NameField() {
    var name by rememberSaveable { mutableStateOf("") }

    OutlinedTextField(
        value = name,
        onValueChange = { name = it }, // skip this and typing does nothing
        label = { Text("Name") },
        singleLine = true,
    )
}
