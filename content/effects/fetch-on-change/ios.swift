struct Profile: View { // @link:fn
    let userId: String // @link:fn
    @State private var user: User? // @link:state

    var body: some View {
        Group {
            if let user { // @link:render
                Text(user.name) // @link:render
            } else {
                ProgressView() // @link:loading
            }
        }
        // Runs when the view appears, and again whenever userId changes.
        // The previous task is cancelled first. // @link:cancel
        .task(id: userId) { // @link:effect
            if let fetched = try? await fetchUser(id: userId) { // @link:fetch
                user = fetched // @link:assign
            }
        }
    }
}
