struct Panel<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading) {
            Text(title).fontWeight(.semibold)
            content
        }
        .padding(16)
    }
}

// Usage: the trailing closure is the "children"
Panel(title: "Today") {
    Text("Buy milk")
    Text("Walk the dog")
}
