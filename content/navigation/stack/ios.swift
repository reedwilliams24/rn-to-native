struct RootView: View {
    var body: some View {
        NavigationStack { // @link:host,stack
            HomeScreen() // @link:home
                // Any NavigationLink(value:) with a UUID below pushes this
                .navigationDestination(for: UUID.self) { id in // @link:detail,routes
                    DetailScreen(id: id) // @link:detail,params
                }
        }
    }
}

// HomeScreen: NavigationLink(todo.title, value: todo.id) // @link:push
