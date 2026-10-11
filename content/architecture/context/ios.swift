struct Session { // @link:type
    let userId: String
    let displayName: String
}

// @Entry (Xcode 16+) declares a custom environment key with a default.
extension EnvironmentValues {
    @Entry var session: Session? = nil // @link:key,missing
}

struct Root: View { // @link:root
    let session: Session

    var body: some View {
        ProfileHeader() // @link:child
            .environment(\.session, session) // @link:provide
    }
}

struct ProfileHeader: View { // @link:header
    @Environment(\.session) private var session // @link:read,read2

    var body: some View {
        Text("Signed in as \(session?.displayName ?? "guest")") // @link:text
    }
}
