// Todos/DueLabel.swift (app target) // @link:file
func dueLabel(daysLeft: Int) -> String { // @link:fn
    switch daysLeft {
    case ..<0: "Overdue" // @link:overdue
    case 0: "Due today" // @link:today
    case 1: "Due tomorrow" // @link:tomorrow
    default: "Due in \(daysLeft) days" // @link:later
    }
}

// TodosTests/DueLabelTests.swift (test target) // @link:testfile
import Testing
@testable import Todos

struct DueLabelTests { // @link:suite
    @Test func negativeDaysAreOverdue() { // @link:neg-test
        #expect(dueLabel(daysLeft: -2) == "Overdue") // @link:neg-assert
    }

    @Test(arguments: [(0, "Due today"), (1, "Due tomorrow"), (3, "Due in 3 days")]) // @link:table
    func labelsUpcomingDays(days: Int, expected: String) { // @link:table
        #expect(dueLabel(daysLeft: days) == expected) // @link:table-assert
    }
}
