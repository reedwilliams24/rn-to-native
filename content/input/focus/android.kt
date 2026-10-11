@Composable
fun LoginForm(onLogin: () -> Unit) { // @link:fn
    var email by remember { mutableStateOf("") } // @link:email-state
    var password by remember { mutableStateOf("") } // @link:pw-state
    val emailFocus = remember { FocusRequester() } // @link:focusref
    val passwordFocus = remember { FocusRequester() } // @link:focusref
    val focusManager = LocalFocusManager.current // @link:dismiss

    LaunchedEffect(Unit) { emailFocus.requestFocus() } // autoFocus // @link:autofocus

    Column { // @link:container
        OutlinedTextField( // @link:email-field
            value = email, // @link:email-field
            onValueChange = { email = it }, // @link:email-field
            label = { Text("Email") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next), // @link:next
            keyboardActions = KeyboardActions(onNext = { passwordFocus.requestFocus() }), // @link:focus-next
            modifier = Modifier.focusRequester(emailFocus), // @link:focusref
        )
        OutlinedTextField( // @link:pw-field
            value = password, // @link:pw-field
            onValueChange = { password = it }, // @link:pw-field
            label = { Text("Password") },
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(), // secureTextEntry // @link:secure
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done, // @link:done
            ),
            keyboardActions = KeyboardActions(onDone = { // @link:submit
                focusManager.clearFocus() // Keyboard.dismiss() // @link:dismiss
                onLogin() // @link:login
            }),
            modifier = Modifier.focusRequester(passwordFocus), // @link:focusref
        )
    }
}
