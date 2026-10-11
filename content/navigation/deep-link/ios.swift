struct RootView: View {
    @State private var path: [UUID] = []

    var body: some View {
        NavigationStack(path: $path) {
            HomeScreen()
                .navigationDestination(for: UUID.self) { DetailScreen(id: $0) } // @link:screen
        }
        // Register the myapp:// scheme under URL Types in the target's Info tab // @link:register
        .onOpenURL { url in // @link:config
            // myapp://todo/<id>
            guard url.host() == "todo", // @link:route
                  let id = UUID(uuidString: url.lastPathComponent) else { return } // @link:route
            path = [id] // @link:route
        }
    }
}
