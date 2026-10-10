struct PinField: View {
    @State private var pin = ""

    var body: some View {
        TextField("PIN", text: $pin)
            .keyboardType(.numberPad)
            // The binding has already written the new text. Correct it after.
            .onChange(of: pin) { _, new in
                let cleaned = String(new.filter(\.isWholeNumber).prefix(6))
                if cleaned != new { pin = cleaned }
            }
    }
}
