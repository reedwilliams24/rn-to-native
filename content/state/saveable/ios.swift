struct SearchScreen: View {
    // @State survives rotation (views aren't torn down), but not the app
    // being killed in the background. @SceneStorage restores it on relaunch.
    @SceneStorage("search.query") private var query = ""

    var body: some View {
        TextField("Search", text: $query)
    }
}
