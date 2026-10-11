struct EditScreen: View { // @link:fn
    @Environment(\.dismiss) private var dismiss
    @State private var dirty = false // @link:dirty
    @State private var confirming = false // @link:confirm

    var body: some View {
        EditForm(onChange: { dirty = true }) // @link:form
            // There's no hook into the system back button, so replace it.
            // This also disables swipe-to-go-back.
            .navigationBarBackButtonHidden() // @link:intercept
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Back") {
                        if dirty { confirming = true } else { dismiss() } // @link:guard
                    }
                }
            }
            .confirmationDialog("Discard changes?", isPresented: $confirming) { // @link:dialog
                Button("Discard", role: .destructive) { dismiss() } // @link:discard
            }
    }
}
