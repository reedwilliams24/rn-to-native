import Testing
@testable import Todos

struct Offline: Error {}

@MainActor
struct TodoListModelTests {
    @Test func refreshShowsLoadedTodos() async {
        let repo = FakeTodoRepository(result: .success([Todo(id: "1", title: "Buy milk")]))
        let model = TodoListModel(repository: repo)

        await model.refresh()

        #expect(model.state == .loaded([Todo(id: "1", title: "Buy milk")]))
        #expect(await repo.loadCalls == 1)
    }

    @Test func networkFailureShowsAnError() async {
        let model = TodoListModel(repository: FakeTodoRepository(result: .failure(Offline())))

        await model.refresh()

        #expect(model.state == .error("Couldn't load todos"))
    }
}
