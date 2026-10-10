@Composable
fun Feed(onRefresh: () -> Unit) {
    // From lifecycle-runtime-compose. Fires on every ON_RESUME: when the app
    // comes to the foreground, and also on first display and when returning
    // from another Activity.
    LifecycleEventEffect(Lifecycle.Event.ON_RESUME) {
        onRefresh()
    }

    FeedList()
}
