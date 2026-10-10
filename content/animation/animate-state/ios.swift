struct LikeButton: View {
    let liked: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            Image(systemName: "heart.fill")
                .foregroundStyle(liked ? .red : .gray)
                .scaleEffect(liked ? 1.3 : 1)
                .animation(.bouncy, value: liked)
        }
        .accessibilityLabel(liked ? "Unlike" : "Like")
    }
}

// Or animate at the point of change, for every view that depends on it:
// withAnimation(.bouncy) { todo.liked.toggle() }
