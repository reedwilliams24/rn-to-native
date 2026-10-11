struct TodoRow: View { // @link:fn
    let title: String
    let due: String
    let done: Bool
    let onToggle: () -> Void

    var body: some View {
        // Button combines its label's children into one VoiceOver element // @link:group
        Button(action: onToggle) { // @link:toggle,group
            HStack(spacing: 8) {
                Image(systemName: done ? "checkmark.circle.fill" : "circle") // @link:check
                    .accessibilityHidden(true)
                VStack(alignment: .leading) {
                    Text(title) // @link:title
                    Text("Due \(due)").font(.caption) // @link:due
                }
            }
            .padding(16)
        }
        .buttonStyle(.plain)
        .accessibilityValue(done ? "Done" : "Not done") // @link:state,role
    }
}
// VoiceOver: "Buy milk, Due Friday, Not done, Button"
