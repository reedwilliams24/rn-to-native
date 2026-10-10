// Todos/DueLabel.swift (app target)
func dueLabel(daysLeft: Int) -> String {
    switch daysLeft {
    case ..<0: "Overdue"
    case 0: "Due today"
    case 1: "Due tomorrow"
    default: "Due in \(daysLeft) days"
    }
}

// TodosTests/DueLabelTests.swift (test target)
import Testing
@testable import Todos

struct DueLabelTests {
    @Test func negativeDaysAreOverdue() {
        #expect(dueLabel(daysLeft: -2) == "Overdue")
    }

    @Test(arguments: [(0, "Due today"), (1, "Due tomorrow"), (3, "Due in 3 days")])
    func labelsUpcomingDays(days: Int, expected: String) {
        #expect(dueLabel(daysLeft: days) == expected)
    }
}
