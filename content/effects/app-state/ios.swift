struct Feed: View {
    let onRefresh: () -> Void
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        FeedList()
            .onChange(of: scenePhase) { _, phase in
                if phase == .active { onRefresh() }
            }
    }
}
