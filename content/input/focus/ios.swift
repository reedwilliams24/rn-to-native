struct LoginForm: View { // @link:fn
    enum Field { case email, password } // @link:focusref

    let onLogin: () -> Void // @link:fn
    @State private var email = "" // @link:email-state
    @State private var password = "" // @link:pw-state
    @FocusState private var focused: Field? // nil means nothing is focused // @link:focusref

    var body: some View {
        VStack { // @link:container
            TextField("Email", text: $email) // @link:email-field
                .focused($focused, equals: .email) // @link:focusref
                .submitLabel(.next) // @link:next
                .onSubmit { focused = .password } // @link:focus-next
            SecureField("Password", text: $password) // secureTextEntry // @link:pw-field,secure
                .focused($focused, equals: .password) // @link:focusref
                .submitLabel(.done) // @link:done
                .onSubmit { // @link:submit
                    focused = nil // Keyboard.dismiss() // @link:dismiss
                    onLogin() // @link:login
                }
        }
        .onAppear { focused = .email } // autoFocus // @link:autofocus
    }
}
