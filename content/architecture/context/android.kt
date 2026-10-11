data class Session(val userId: String, val displayName: String) // @link:type

// The default runs only if nobody provided a value, like a missing Provider.
val LocalSession = staticCompositionLocalOf<Session> { // @link:key
    error("No Session provided") // @link:missing
}

@Composable
fun Root(session: Session) { // @link:root
    CompositionLocalProvider(LocalSession provides session) { // @link:provide
        ProfileHeader() // @link:child
    }
}

@Composable
fun ProfileHeader() { // @link:header
    val session = LocalSession.current // @link:read,read2
    Text("Signed in as ${session.displayName}") // @link:text
}
