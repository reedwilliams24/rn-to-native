struct AddTodo: View { // @link:fn
    @State private var adding = false // @link:state

    var body: some View {
        Button("New todo") { adding = true } // @link:open
            // Swiping down sets adding back to false for you // @link:dismiss
            .sheet(isPresented: $adding) { // @link:modal
                NewTodoForm(onDone: { adding = false }) // @link:form
                    .presentationDetents([.medium, .large]) // @link:detents
            }
    }
}
