struct TodoRow: View {
    let title: String
    let done: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 8) {
                Image(systemName: done ? "checkmark.circle.fill" : "circle")
                Text(title)
            }
            .padding(16)
        }
        .buttonStyle(.plain)
    }
}
