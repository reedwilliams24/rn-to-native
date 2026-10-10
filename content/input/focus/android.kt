@Composable
fun LoginForm(onLogin: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val emailFocus = remember { FocusRequester() }
    val passwordFocus = remember { FocusRequester() }
    val focusManager = LocalFocusManager.current

    LaunchedEffect(Unit) { emailFocus.requestFocus() } // autoFocus

    Column {
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
            keyboardActions = KeyboardActions(onNext = { passwordFocus.requestFocus() }),
            modifier = Modifier.focusRequester(emailFocus),
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(), // secureTextEntry
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done,
            ),
            keyboardActions = KeyboardActions(onDone = {
                focusManager.clearFocus() // Keyboard.dismiss()
                onLogin()
            }),
            modifier = Modifier.focusRequester(passwordFocus),
        )
    }
}
