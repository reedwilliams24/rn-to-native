// Documents: kept and backed up. Caches: not backed up; the system may purge it.
func exportTodos(_ todos: [Todo]) throws -> URL {
    let url = URL.documentsDirectory.appending(path: "export.json")
    try JSONEncoder().encode(todos).write(to: url, options: .atomic)
    return url
}

func cacheThumbnail(id: String, data: Data) throws -> URL {
    let url = URL.cachesDirectory.appending(path: "thumb-\(id).jpg")
    try data.write(to: url)
    return url
}
