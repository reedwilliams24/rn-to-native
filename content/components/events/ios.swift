struct TodoRow: View { // @link:fn,props
    let title: String // @link:title
    let done: Bool // @link:done
    let onToggle: () -> Void // @link:callback

    var body: some View { // @link:body
        Button(action: onToggle) { // @link:pressable,tap
            HStack(spacing: 8) { // @link:row
                Image(systemName: done ? "checkmark.circle.fill" : "circle") // @link:check
                Text(title) // @link:label
            }
            .padding(16) // @link:row
        }
        .buttonStyle(.plain) // @link:pressable
    }
}
