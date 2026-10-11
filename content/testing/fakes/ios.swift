struct Todo: Identifiable, Equatable, Sendable { // @link:model
    let id: String
    var title: String
    var done = false
}

// Production code depends on a protocol… // @link:iface
protocol TodoRepository: Sendable { // @link:iface
    func load() async throws -> [Todo] // @link:load
}

// …which the real app implements with URLSession (Chapter 12) // @link:impl
// and tests implement with a hand-written fake.
actor FakeTodoRepository: TodoRepository { // @link:fake
    private let result: Result<[Todo], any Error> // @link:result
    private(set) var loadCalls = 0 // @link:calls

    init(result: Result<[Todo], any Error>) {
        self.result = result
    }

    func load() async throws -> [Todo] { // @link:fakeload
        loadCalls += 1 // @link:calls
        return try result.get() // @link:result
    }
}

// The dependency comes in through the initializer (Chapter 10) // @link:inject
@MainActor @Observable
final class TodoListModel { // @link:inject
    private let repository: any TodoRepository // @link:inject
    init(repository: any TodoRepository) { self.repository = repository }
    // …
}
