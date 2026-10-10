struct Todo: Codable, Identifiable {
    let id: String
    var title: String
    var done: Bool
    var dueDate: Date?   // Optional: may be missing or null
}

extension JSONDecoder {
    static let api: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase  // due_date → dueDate
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
}

func parseTodos(_ data: Data) throws -> [Todo] {
    try JSONDecoder.api.decode([Todo].self, from: data)
}
