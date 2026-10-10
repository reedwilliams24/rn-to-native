enum LoadState {
    case loading
    case success(todos: [Todo])
    case error(message: String)
}

func label(_ state: LoadState) -> String {
    switch state {
    case .loading: "Loading…"
    case .success(let todos): "\(todos.count) todos"
    case .error(let message): "Error: \(message)"
    }
}
