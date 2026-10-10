// No first-party equivalent: this uses ViewInspector (third-party, SPM)
import Testing
import ViewInspector
@testable import Todos

@MainActor
struct TodoRowTests {
    @Test func tappingTheRowTogglesIt() throws {
        var toggles = 0
        let row = TodoRow(title: "Buy milk", done: false, onToggle: { toggles += 1 })

        try row.inspect().find(ViewType.Button.self).tap()

        #expect(toggles == 1)
    }

    @Test func showsTheTitle() throws {
        let row = TodoRow(title: "Buy milk", done: false, onToggle: {})

        let title = try row.inspect().find(text: "Buy milk")

        #expect(try title.string() == "Buy milk")
    }
}
