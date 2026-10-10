struct AddTodo: View {
    @State private var adding = false

    var body: some View {
        Button("New todo") { adding = true }
            // Swiping down sets adding back to false for you
            .sheet(isPresented: $adding) {
                NewTodoForm(onDone: { adding = false })
                    .presentationDetents([.medium, .large])
            }
    }
}
