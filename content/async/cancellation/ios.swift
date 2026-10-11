struct SearchResults: View { // @link:fn
    let query: String
    let api: TodoAPI
    @State private var results: [Todo] = [] // @link:state

    var body: some View {
        List(results) { Text($0.title) } // @link:list
            // A new query cancels the previous task, wherever it is suspended // @link:cancel
            .task(id: query) { // @link:effect
                do {
                    try await Task.sleep(for: .milliseconds(300)) // throws if cancelled // @link:debounce
                    results = try await api.search(query) // @link:search
                } catch { // @link:catch
                    // Cancellation lands here too; nothing to do // @link:catch
                }
            }
    }
}
