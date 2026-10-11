@MainActor
@Observable
final class ExportModel { // @link:model
    private(set) var status = "Idle" // @link:state

    func export(_ todos: [Todo], to dir: URL) async { // @link:fn
        status = "Exporting…"                       // on the main actor // @link:status1
        do {
            let url = try await Self.writeCSV(todos, to: dir) // @link:bg
            status = "Saved \(url.lastPathComponent)"  // back on the main actor // @link:status2
        } catch {
            status = "Export failed"
        }
    }

    // @concurrent (Swift 6.2) runs this on the background thread pool
    @concurrent // @link:thread,bg
    nonisolated static func writeCSV(_ todos: [Todo], to dir: URL) async throws -> URL {
        let csv = todos.map { "\($0.id),\($0.title),\($0.done)" }.joined(separator: "\n") // @link:csv
        let url = dir.appending(path: "todos.csv") // @link:file
        try csv.write(to: url, atomically: true, encoding: .utf8) // @link:write
        return url
    }
}
