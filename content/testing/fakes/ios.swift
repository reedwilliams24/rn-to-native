struct Todo: Identifiable, Equatable, Sendable {
    let id: String
    var title: String
    var done = false
}

// Production code depends on a protocol…
protocol TodoRepository: Sendable {
    func load() async throws -> [Todo]
}

// …which the real app implements with URLSession (Chapter 12)
// and tests implement with a hand-written fake.
actor FakeTodoRepository: TodoRepository {
    private let result: Result<[Todo], any Error>
    private(set) var loadCalls = 0

    init(result: Result<[Todo], any Error>) {
        self.result = result
    }

    func load() async throws -> [Todo] {
        loadCalls += 1
        return try result.get()
    }
}

// The dependency comes in through the initializer (Chapter 10)
@MainActor @Observable
final class TodoListModel {
    private let repository: any TodoRepository
    init(repository: any TodoRepository) { self.repository = repository }
    // …
}
