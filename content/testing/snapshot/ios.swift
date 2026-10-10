// swift-snapshot-testing (Point-Free, SPM) renders views to PNGs.
// The first run records a reference image; later runs diff against it.
import SnapshotTesting
import SwiftUI
import XCTest
@testable import Todos

final class TodoRowSnapshotTests: XCTestCase {
    @MainActor
    func testOpen() {
        let row = TodoRow(title: "Buy milk", done: false, onToggle: {})

        assertSnapshot(of: row, as: .image(layout: .sizeThatFits))
    }

    @MainActor
    func testDoneDark() {
        let row = TodoRow(title: "Buy milk", done: true, onToggle: {})
            .environment(\.colorScheme, .dark)

        assertSnapshot(of: row, as: .image(layout: .sizeThatFits))
    }
}
