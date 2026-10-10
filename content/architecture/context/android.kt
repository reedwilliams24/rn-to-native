data class Session(val userId: String, val displayName: String)

// The default runs only if nobody provided a value, like a missing Provider.
val LocalSession = staticCompositionLocalOf<Session> {
    error("No Session provided")
}

@Composable
fun Root(session: Session) {
    CompositionLocalProvider(LocalSession provides session) {
        ProfileHeader()
    }
}

@Composable
fun ProfileHeader() {
    val session = LocalSession.current
    Text("Signed in as ${session.displayName}")
}
