struct TodoAPI {
    var baseURL = URL(string: "https://api.example.com")!
    var session = URLSession.shared

    func getTodos() async throws -> [Todo] {
        let (data, response) = try await session.data(from: baseURL.appending(path: "todos"))
        try Self.check(response)
        return try JSONDecoder.api.decode([Todo].self, from: data)
    }

    func createTodo(_ input: NewTodo) async throws -> Todo {
        var request = URLRequest(url: baseURL.appending(path: "todos"))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(input)
        let (data, response) = try await session.data(for: request)
        try Self.check(response)
        return try JSONDecoder.api.decode(Todo.self, from: data)
    }

    // Like fetch, URLSession doesn't throw for 4xx/5xx
    static func check(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else { throw URLError(.badServerResponse) }
        guard (200..<300).contains(http.statusCode) else { throw APIError.http(status: http.statusCode) }
    }
}
