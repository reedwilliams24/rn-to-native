@Composable
fun PinField() { // @link:fn
    var pin by remember { mutableStateOf("") } // @link:state

    OutlinedTextField( // @link:field
        value = pin, // @link:value
        // Reshape input before it lands: whatever you store is what's shown
        onValueChange = { new -> pin = new.filter(Char::isDigit).take(6) }, // @link:filter
        label = { Text("PIN") }, // @link:label
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword), // @link:kb
    )
}
