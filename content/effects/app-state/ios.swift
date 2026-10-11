struct Feed: View { // @link:fn
    let onRefresh: () -> Void // @link:fn
    @Environment(\.scenePhase) private var scenePhase // @link:listen

    var body: some View {
        FeedList() // @link:content
            .onChange(of: scenePhase) { _, phase in // @link:effect,listen
                if phase == .active { onRefresh() } // @link:active
            }
    }
}
