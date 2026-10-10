struct SearchResults: View {
    let query: String
    let api: TodoAPI
    @State private var results: [Todo] = []

    var body: some View {
        List(results) { Text($0.title) }
            // A new query cancels the previous task, wherever it is suspended
            .task(id: query) {
                do {
                    try await Task.sleep(for: .milliseconds(300)) // throws if cancelled
                    results = try await api.search(query)
                } catch {
                    // Cancellation lands here too; nothing to do
                }
            }
    }
}
