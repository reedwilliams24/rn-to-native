struct Profile: View {
    let userId: String
    @State private var user: User?

    var body: some View {
        Group {
            if let user {
                Text(user.name)
            } else {
                ProgressView()
            }
        }
        // Runs when the view appears, and again whenever userId changes.
        // The previous task is cancelled first.
        .task(id: userId) {
            if let fetched = try? await fetchUser(id: userId) {
                user = fetched
            }
        }
    }
}
