struct RootView: View {
    @State private var path: [UUID] = []

    var body: some View {
        NavigationStack(path: $path) {
            HomeScreen()
                .navigationDestination(for: UUID.self) { DetailScreen(id: $0) }
        }
        // Register the myapp:// scheme under URL Types in the target's Info tab
        .onOpenURL { url in
            // myapp://todo/<id>
            guard url.host() == "todo",
                  let id = UUID(uuidString: url.lastPathComponent) else { return }
            path = [id]
        }
    }
}
