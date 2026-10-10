@Composable
fun SignUp(onSubmit: (String) -> Unit) {
    var email by rememberSaveable { mutableStateOf("") }
    var submitted by rememberSaveable { mutableStateOf(false) }
    val valid = "@" in email
    val error = if (submitted && !valid) "Enter a valid email" else null

    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            singleLine = true,
            isError = error != null, // red outline and label
            supportingText = if (error != null) {
                { Text(error) }
            } else {
                null
            },
        )
        Button(onClick = {
            submitted = true
            if (valid) onSubmit(email)
        }) {
            Text("Sign up")
        }
    }
}
