struct TodoGroup: Identifiable { // @link:type
    let title: String
    let todos: [Todo]
    var id: String { title }
}

struct TodoSections: View { // @link:fn
    let groups: [TodoGroup]

    var body: some View {
        List { // @link:list
            ForEach(groups) { group in // @link:groups
                Section(group.title) { // @link:header
                    ForEach(group.todos) { todo in // @link:items
                        TodoRow(todo: todo) // @link:items
                    }
                }
            }
        }
        .listStyle(.plain) // plain lists pin section headers while scrolling // @link:sticky
    }
}
