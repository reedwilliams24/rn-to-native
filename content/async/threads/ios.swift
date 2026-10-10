@MainActor
@Observable
final class ExportModel {
    private(set) var status = "Idle"

    func export(_ todos: [Todo], to dir: URL) async {
        status = "Exporting…"                       // on the main actor
        do {
            let url = try await Self.writeCSV(todos, to: dir)
            status = "Saved \(url.lastPathComponent)"  // back on the main actor
        } catch {
            status = "Export failed"
        }
    }

    // @concurrent (Swift 6.2) runs this on the background thread pool
    @concurrent
    nonisolated static func writeCSV(_ todos: [Todo], to dir: URL) async throws -> URL {
        let csv = todos.map { "\($0.id),\($0.title),\($0.done)" }.joined(separator: "\n")
        let url = dir.appending(path: "todos.csv")
        try csv.write(to: url, atomically: true, encoding: .utf8)
        return url
    }
}
