enum Route: Hashable {
    case detail(id: UUID)
    case settings
}

// You own the back stack: it's just an array
@Observable final class Router {
    var path: [Route] = []

    func openDetail(_ id: UUID) { path.append(.detail(id: id)) }
    func openSettings() { path.append(.settings) }
    func goBack() { path.removeLast() }
    func popToRoot() { path.removeAll() }
}

struct RootView: View {
    @State private var router = Router()

    var body: some View {
        NavigationStack(path: $router.path) {
            HomeScreen()
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .detail(let id): DetailScreen(id: id)
                    case .settings: SettingsScreen()
                    }
                }
        }
        .environment(router) // screens read it with @Environment(Router.self)
    }
}
