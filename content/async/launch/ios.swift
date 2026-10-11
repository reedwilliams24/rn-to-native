struct SaveButton: View { // @link:fn
    let todo: Todo // @link:fn
    let api: TodoAPI
    @State private var saving = false // @link:state

    var body: some View {
        Button(saving ? "Saving…" : "Save") { // @link:button,label,handler
            // Unstructured task: inherits the main actor, but is NOT
            // cancelled when the view disappears
            Task { // @link:scope
                saving = true // @link:start
                defer { saving = false } // @link:finally,finish
                try? await api.save(todo) // @link:save,try
            }
        }
        .disabled(saving) // @link:disabled
    }
}
