struct LoginForm: View {
    enum Field { case email, password }

    let onLogin: () -> Void
    @State private var email = ""
    @State private var password = ""
    @FocusState private var focused: Field? // nil means nothing is focused

    var body: some View {
        VStack {
            TextField("Email", text: $email)
                .focused($focused, equals: .email)
                .submitLabel(.next)
                .onSubmit { focused = .password }
            SecureField("Password", text: $password) // secureTextEntry
                .focused($focused, equals: .password)
                .submitLabel(.done)
                .onSubmit {
                    focused = nil // Keyboard.dismiss()
                    onLogin()
                }
        }
        .onAppear { focused = .email } // autoFocus
    }
}
