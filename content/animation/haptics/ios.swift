struct CompleteButton: View { // @link:fn
    @Binding var done: Bool

    var body: some View {
        Button("Complete") { done = true } // @link:button,label,handler,complete
            // Declarative: plays whenever `done` changes to true
            .sensoryFeedback(.success, trigger: done) { _, isDone in isDone } // @link:haptic
    }
}
