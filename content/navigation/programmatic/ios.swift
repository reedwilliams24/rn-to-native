enum Route: Hashable { // @link:routes
    case detail(id: UUID) // @link:routes
    case settings // @link:routes
}

// You own the back stack: it's just an array
@Observable final class Router { // @link:nav
    var path: [Route] = [] // @link:nav

    func openDetail(_ id: UUID) { path.append(.detail(id: id)) } // @link:detail
    func openSettings() { path.append(.settings) } // @link:settings
    func goBack() { path.removeLast() } // @link:back
    func popToRoot() { path.removeAll() } // @link:root
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
