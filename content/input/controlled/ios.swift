struct PinField: View { // @link:fn
    @State private var pin = "" // @link:state

    var body: some View {
        TextField("PIN", text: $pin) // @link:field,value,label
            .keyboardType(.numberPad) // @link:kb
            // The binding has already written the new text. Correct it after.
            .onChange(of: pin) { _, new in // @link:filter
                let cleaned = String(new.filter(\.isWholeNumber).prefix(6)) // @link:filter
                if cleaned != new { pin = cleaned } // @link:filter
            }
    }
}
