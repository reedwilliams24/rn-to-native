struct NameField: View { // @link:fn
    @State private var name = "" // @link:state

    var body: some View {
        TextField("Name", text: $name) // the binding is value + onChange in one // @link:field,value,change,label
            .textFieldStyle(.roundedBorder) // @link:style
    }
}
