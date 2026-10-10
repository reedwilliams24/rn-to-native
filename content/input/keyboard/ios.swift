struct EmailField: View {
    @Binding var email: String
    let onSubmit: () -> Void

    var body: some View {
        TextField("Email", text: $email)
            .keyboardType(.emailAddress)
            .textContentType(.emailAddress) // autoComplete / autofill
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled()
            .submitLabel(.go) // returnKeyType
            .onSubmit(onSubmit) // onSubmitEditing
    }
}
