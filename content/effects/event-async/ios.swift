struct SaveButton: View { // @link:fn
    let todo: Todo // @link:fn
    @State private var saving = false // @link:state

    var body: some View {
        Button(saving ? "Saving…" : "Save") { // @link:button,label,handler
            // An unstructured Task: it keeps running if the view disappears
            Task { // @link:scope
                saving = true // @link:start
                defer { saving = false } // @link:finally,finish
                try? await saveTodo(todo) // @link:save,try
            }
        }
        .disabled(saving) // @link:disabled
    }
}
