struct EditScreen: View {
    @Environment(\.dismiss) private var dismiss
    @State private var dirty = false
    @State private var confirming = false

    var body: some View {
        EditForm(onChange: { dirty = true })
            // There's no hook into the system back button, so replace it.
            // This also disables swipe-to-go-back.
            .navigationBarBackButtonHidden()
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Back") {
                        if dirty { confirming = true } else { dismiss() }
                    }
                }
            }
            .confirmationDialog("Discard changes?", isPresented: $confirming) {
                Button("Discard", role: .destructive) { dismiss() }
            }
    }
}
