struct TodoGroup: Identifiable {
    let title: String
    let todos: [Todo]
    var id: String { title }
}

struct TodoSections: View {
    let groups: [TodoGroup]

    var body: some View {
        List {
            ForEach(groups) { group in
                Section(group.title) {
                    ForEach(group.todos) { todo in
                        TodoRow(todo: todo)
                    }
                }
            }
        }
        .listStyle(.plain) // plain lists pin section headers while scrolling
    }
}
