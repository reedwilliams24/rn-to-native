struct CompleteButton: View {
    @Binding var done: Bool

    var body: some View {
        Button("Complete") { done = true }
            // Declarative: plays whenever `done` changes to true
            .sensoryFeedback(.success, trigger: done) { _, isDone in isDone }
    }
}
