struct Todo: Codable, Identifiable { // @link:model
    let id: String // @link:id
    var title: String // @link:title
    var done: Bool // @link:done
    var dueDate: Date?   // Optional: may be missing or null // @link:due
}

extension JSONDecoder {
    static let api: JSONDecoder = { // @link:config
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase  // due_date → dueDate // @link:due,config
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
}

func parseTodos(_ data: Data) throws -> [Todo] { // @link:parse
    try JSONDecoder.api.decode([Todo].self, from: data) // @link:parse
}
