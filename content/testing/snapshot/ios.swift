// swift-snapshot-testing (Point-Free, SPM) renders views to PNGs. // @link:lib
// The first run records a reference image; later runs diff against it.
import SnapshotTesting // @link:lib
import SwiftUI
import XCTest
@testable import Todos

final class TodoRowSnapshotTests: XCTestCase { // @link:suite
    @MainActor
    func testOpen() { // @link:open
        let row = TodoRow(title: "Buy milk", done: false, onToggle: {}) // @link:open-row

        assertSnapshot(of: row, as: .image(layout: .sizeThatFits)) // @link:snap
    }

    @MainActor
    func testDoneDark() { // @link:done
        let row = TodoRow(title: "Buy milk", done: true, onToggle: {}) // @link:done-row
            .environment(\.colorScheme, .dark)

        assertSnapshot(of: row, as: .image(layout: .sizeThatFits)) // @link:snap
    }
}
