// TodosUITests/AddTodoUITests.swift (separate UI test target)
import XCTest

final class AddTodoUITests: XCTestCase {
    @MainActor
    func testAddingATodoShowsItInTheList() {
        let app = XCUIApplication()
        app.launchArguments = ["-ui-testing"]
        app.launch()

        let input = app.textFields["new-todo-input"]
        input.tap()
        input.typeText("Buy milk")
        app.buttons["add-todo"].tap()

        XCTAssertTrue(app.staticTexts["Buy milk"].waitForExistence(timeout: 2))
    }
}

// In the app
TextField("New todo", text: $title)
    .accessibilityIdentifier("new-todo-input")
