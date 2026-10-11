// TodosUITests/AddTodoUITests.swift (separate UI test target) // @link:file
import XCTest

final class AddTodoUITests: XCTestCase { // @link:suite
    @MainActor
    func testAddingATodoShowsItInTheList() { // @link:test
        let app = XCUIApplication() // @link:launch
        app.launchArguments = ["-ui-testing"]
        app.launch() // @link:launch

        let input = app.textFields["new-todo-input"]
        input.tap()
        input.typeText("Buy milk") // @link:type
        app.buttons["add-todo"].tap() // @link:tap

        XCTAssertTrue(app.staticTexts["Buy milk"].waitForExistence(timeout: 2)) // @link:assert
    }
}

// In the app
TextField("New todo", text: $title)
    .accessibilityIdentifier("new-todo-input") // @link:tag
