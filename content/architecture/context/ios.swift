struct Session {
    let userId: String
    let displayName: String
}

// @Entry (Xcode 16+) declares a custom environment key with a default.
extension EnvironmentValues {
    @Entry var session: Session? = nil
}

struct Root: View {
    let session: Session

    var body: some View {
        ProfileHeader()
            .environment(\.session, session)
    }
}

struct ProfileHeader: View {
    @Environment(\.session) private var session

    var body: some View {
        Text("Signed in as \(session?.displayName ?? "guest")")
    }
}
