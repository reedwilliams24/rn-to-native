struct TitleRow: View {
    let title: String
    let onEdit: () -> Void

    var body: some View {
        HStack {
            Text(title)
                .lineLimit(1)
                // flex: 1: take all spare width, keep text on the left
                .frame(maxWidth: .infinity, alignment: .leading)
            Button("Edit", action: onEdit)
        }
    }
}
