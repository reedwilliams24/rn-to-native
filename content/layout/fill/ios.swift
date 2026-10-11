struct TitleRow: View { // @link:fn
    let title: String // @link:fn
    let onEdit: () -> Void // @link:fn

    var body: some View {
        HStack { // @link:row
            Text(title) // @link:text
                .lineLimit(1) // @link:lines
                // flex: 1: take all spare width, keep text on the left
                .frame(maxWidth: .infinity, alignment: .leading) // @link:flex
            Button("Edit", action: onEdit) // @link:edit
        }
    }
}
