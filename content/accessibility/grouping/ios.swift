struct TodoRow: View {
    let title: String
    let due: String
    let done: Bool
    let onToggle: () -> Void

    var body: some View {
        // Button combines its label's children into one VoiceOver element
        Button(action: onToggle) {
            HStack(spacing: 8) {
                Image(systemName: done ? "checkmark.circle.fill" : "circle")
                    .accessibilityHidden(true)
                VStack(alignment: .leading) {
                    Text(title)
                    Text("Due \(due)").font(.caption)
                }
            }
            .padding(16)
        }
        .buttonStyle(.plain)
        .accessibilityValue(done ? "Done" : "Not done")
    }
}
// VoiceOver: "Buy milk, Due Friday, Not done, Button"
