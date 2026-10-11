enum LoadState { // @link:type
    case loading // @link:loading
    case success(todos: [Todo]) // @link:success
    case error(message: String) // @link:error
}

func label(_ state: LoadState) -> String { // @link:fn
    switch state { // @link:switch
    case .loading: "Loading…" // @link:loading-case
    case .success(let todos): "\(todos.count) todos" // @link:success-case
    case .error(let message): "Error: \(message)" // @link:error-case
    }
}
