import SwiftData

// The class *is* the schema: no SQL, no DAO
@Model
final class Todo {
    var title: String
    var done: Bool
    var createdAt: Date

    init(title: String, done: Bool = false, createdAt: Date = .now) {
        self.title = title
        self.done = done
        self.createdAt = createdAt
    }
}

@main
struct TodoApp: App {
    var body: some Scene {
        WindowGroup {
            TodoListView()
        }
        // Opens (or creates) the store and puts a ModelContext in the environment
        .modelContainer(for: Todo.self)
    }
}
