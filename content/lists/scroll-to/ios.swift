struct TodoListWithTop: View { // @link:fn
    let todos: [Todo]

    var body: some View {
        ScrollViewReader { proxy in // proxy is the "ref" // @link:ref
            List(todos) { todo in // @link:list,items
                TodoRow(todo: todo) // @link:items
            }
            .overlay(alignment: .bottomTrailing) { // @link:container,pos
                Button("Back to top", systemImage: "arrow.up") { // @link:button,icon
                    guard let first = todos.first else { return } // @link:scroll
                    withAnimation { proxy.scrollTo(first.id, anchor: .top) } // @link:scroll
                }
                .labelStyle(.iconOnly)
                .buttonStyle(.borderedProminent)
                .padding() // @link:pos
            }
        }
    }
}
