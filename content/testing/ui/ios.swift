// No first-party equivalent: this uses ViewInspector (third-party, SPM) // @link:lib
import Testing
import ViewInspector // @link:lib
@testable import Todos

@MainActor
struct TodoRowTests { // @link:suite
    @Test func tappingTheRowTogglesIt() throws { // @link:tap-test
        var toggles = 0 // @link:counter
        let row = TodoRow(title: "Buy milk", done: false, onToggle: { toggles += 1 }) // @link:render

        try row.inspect().find(ViewType.Button.self).tap() // @link:tap

        #expect(toggles == 1) // @link:assert
    }

    @Test func showsTheTitle() throws {
        let row = TodoRow(title: "Buy milk", done: false, onToggle: {})

        let title = try row.inspect().find(text: "Buy milk")

        #expect(try title.string() == "Buy milk")
    }
}
