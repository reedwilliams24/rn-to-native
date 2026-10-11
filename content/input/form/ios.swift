struct SignUp: View { // @link:fn
    let onSubmit: (String) -> Void // @link:fn
    @State private var email = "" // @link:email
    @State private var submitted = false // @link:submitted

    private var valid: Bool { email.contains("@") } // @link:valid

    var body: some View {
        Form { // @link:container
            Section {
                TextField("Email", text: $email) // @link:field
            } footer: {
                if submitted && !valid { // @link:error
                    Text("Enter a valid email").foregroundStyle(.red) // @link:errortext
                }
            }
            Button("Sign up") { // @link:button
                submitted = true // @link:submit
                if valid { onSubmit(email) } // @link:send
            }
        }
    }
}
