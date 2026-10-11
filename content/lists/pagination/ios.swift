struct InfiniteList: View { // @link:fn
    let todos: [Todo] // @link:props
    let loading: Bool // @link:props
    let loadMore: () -> Void // @link:props

    var body: some View {
        List { // @link:list
            ForEach(todos) { todo in // @link:items
                TodoRow(todo: todo) // @link:row
            }
            if loading { // @link:footer
                ProgressView() // @link:footer
            } else {
                // A sentinel row. When it scrolls into view, ask for more.
                Color.clear // @link:threshold
                    .frame(height: 1)
                    .onAppear(perform: loadMore) // @link:trigger
            }
        }
    }
}
