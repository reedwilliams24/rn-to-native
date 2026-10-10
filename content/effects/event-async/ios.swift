struct SaveButton: View {
    let todo: Todo
    @State private var saving = false

    var body: some View {
        Button(saving ? "Saving…" : "Save") {
            // An unstructured Task: it keeps running if the view disappears
            Task {
                saving = true
                defer { saving = false }
                try? await saveTodo(todo)
            }
        }
        .disabled(saving)
    }
}
