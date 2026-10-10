struct SignUp: View {
    let onSubmit: (String) -> Void
    @State private var email = ""
    @State private var submitted = false

    private var valid: Bool { email.contains("@") }

    var body: some View {
        Form {
            Section {
                TextField("Email", text: $email)
            } footer: {
                if submitted && !valid {
                    Text("Enter a valid email").foregroundStyle(.red)
                }
            }
            Button("Sign up") {
                submitted = true
                if valid { onSubmit(email) }
            }
        }
    }
}
