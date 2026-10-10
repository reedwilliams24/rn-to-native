struct SaveButton: View {
    let todo: Todo
    let api: TodoAPI
    @State private var saving = false

    var body: some View {
        Button(saving ? "Saving…" : "Save") {
            // Unstructured task: inherits the main actor, but is NOT
            // cancelled when the view disappears
            Task {
                saving = true
                defer { saving = false }
                try? await api.save(todo)
            }
        }
        .disabled(saving)
    }
}
