struct Panel<Content: View>: View { // @link:fn,props
    let title: String // @link:title
    @ViewBuilder let content: Content // @link:slot

    var body: some View { // @link:body
        VStack(alignment: .leading) { // @link:container
            Text(title).fontWeight(.semibold) // @link:heading
            content // @link:render-slot
        }
        .padding(16) // @link:container
    }
}

// Usage: the trailing closure is the "children"
Panel(title: "Today") { // @link:usage
    Text("Buy milk") // @link:milk
    Text("Walk the dog") // @link:dog
}
