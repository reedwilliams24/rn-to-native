@Composable
fun EmailField(email: String, onEmailChange: (String) -> Unit, onSubmit: () -> Unit) {
    OutlinedTextField(
        value = email,
        onValueChange = onEmailChange,
        label = { Text("Email") },
        singleLine = true, // without this, the return key inserts a newline
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Email,
            capitalization = KeyboardCapitalization.None,
            autoCorrectEnabled = false,
            imeAction = ImeAction.Go, // returnKeyType
        ),
        keyboardActions = KeyboardActions(onGo = { onSubmit() }), // onSubmitEditing
    )
}
