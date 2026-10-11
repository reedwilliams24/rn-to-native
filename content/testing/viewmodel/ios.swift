import Testing
@testable import Todos

struct Offline: Error {}

@MainActor
struct TodoListModelTests {
    @Test func refreshShowsLoadedTodos() async { // @link:ok-test
        let repo = FakeTodoRepository(result: .success([Todo(id: "1", title: "Buy milk")])) // @link:fake,fake-ok
        let model = TodoListModel(repository: repo) // @link:create-ok

        await model.refresh() // @link:refresh-ok,wait-ok

        #expect(model.state == .loaded([Todo(id: "1", title: "Buy milk")])) // @link:assert-ok
        #expect(await repo.loadCalls == 1) // @link:calls
    }

    @Test func networkFailureShowsAnError() async { // @link:err-test
        let model = TodoListModel(repository: FakeTodoRepository(result: .failure(Offline()))) // @link:create-err,fake-err

        await model.refresh() // @link:refresh-err,wait-err

        #expect(model.state == .error("Couldn't load todos")) // @link:assert-err
    }
}
