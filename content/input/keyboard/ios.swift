struct EmailField: View { // @link:fn
    @Binding var email: String // @link:props,value
    let onSubmit: () -> Void // @link:props

    var body: some View {
        TextField("Email", text: $email) // @link:field,label,value
            .keyboardType(.emailAddress) // @link:kbtype
            .textContentType(.emailAddress) // autoComplete / autofill // @link:autocomplete
            .textInputAutocapitalization(.never) // @link:caps
            .autocorrectionDisabled() // @link:correct
            .submitLabel(.go) // returnKeyType // @link:return
            .onSubmit(onSubmit) // onSubmitEditing // @link:submit
    }
}
