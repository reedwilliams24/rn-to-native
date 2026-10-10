@Composable
fun PinField() {
    var pin by remember { mutableStateOf("") }

    OutlinedTextField(
        value = pin,
        // Reshape input before it lands: whatever you store is what's shown
        onValueChange = { new -> pin = new.filter(Char::isDigit).take(6) },
        label = { Text("PIN") },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
    )
}
