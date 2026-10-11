@Composable
fun EmailField(email: String, onEmailChange: (String) -> Unit, onSubmit: () -> Unit) { // @link:fn,props
    OutlinedTextField( // @link:field
        value = email, // @link:value
        onValueChange = onEmailChange, // @link:value
        label = { Text("Email") }, // @link:label
        singleLine = true, // without this, the return key inserts a newline
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Email, // @link:kbtype
            capitalization = KeyboardCapitalization.None, // @link:caps
            autoCorrectEnabled = false, // @link:correct
            imeAction = ImeAction.Go, // returnKeyType // @link:return
        ),
        keyboardActions = KeyboardActions(onGo = { onSubmit() }), // onSubmitEditing // @link:submit
    )
}
