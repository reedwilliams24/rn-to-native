@Composable
fun SignUp(onSubmit: (String) -> Unit) { // @link:fn
    var email by rememberSaveable { mutableStateOf("") } // @link:email
    var submitted by rememberSaveable { mutableStateOf(false) } // @link:submitted
    val valid = "@" in email // @link:valid
    val error = if (submitted && !valid) "Enter a valid email" else null // @link:error

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) { // @link:container
        OutlinedTextField( // @link:field
            value = email, // @link:field
            onValueChange = { email = it }, // @link:field
            label = { Text("Email") },
            singleLine = true,
            isError = error != null, // red outline and label // @link:error
            supportingText = if (error != null) { // @link:errortext
                { Text(error) } // @link:errortext
            } else {
                null
            },
        )
        Button(onClick = { // @link:button
            submitted = true // @link:submit
            if (valid) onSubmit(email) // @link:send
        }) {
            Text("Sign up") // @link:button
        }
    }
}
