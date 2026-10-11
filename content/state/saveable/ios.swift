struct SearchScreen: View { // @link:fn
    // @State survives rotation (views aren't torn down), but not the app // @link:rotation
    // being killed in the background. @SceneStorage restores it on relaunch.
    @SceneStorage("search.query") private var query = "" // @link:state

    var body: some View {
        TextField("Search", text: $query) // @link:field
    }
}
