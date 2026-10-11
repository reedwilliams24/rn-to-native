import SwiftData

// The class *is* the schema: no SQL, no DAO // @link:table
@Model // @link:table,entity
final class Todo { // @link:entity
    var title: String // @link:title
    var done: Bool // @link:done
    var createdAt: Date // @link:created

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
        .modelContainer(for: Todo.self) // @link:open
    }
}
