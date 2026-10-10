struct RootView: View {
    var body: some View {
        NavigationStack {
            HomeScreen()
                // Any NavigationLink(value:) with a UUID below pushes this
                .navigationDestination(for: UUID.self) { id in
                    DetailScreen(id: id)
                }
        }
    }
}

// HomeScreen: NavigationLink(todo.title, value: todo.id)
