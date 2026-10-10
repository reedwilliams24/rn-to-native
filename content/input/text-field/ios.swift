struct NameField: View {
    @State private var name = ""

    var body: some View {
        TextField("Name", text: $name) // the binding is value + onChange in one
            .textFieldStyle(.roundedBorder)
    }
}
