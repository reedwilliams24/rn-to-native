struct AvatarWithBadge: View {
    let count: Int

    var body: some View {
        Circle()
            .fill(.gray)
            .frame(width: 48, height: 48)
            .overlay(alignment: .topTrailing) {
                if count > 0 {
                    Text("\(count)")
                        .font(.caption2)
                        .foregroundStyle(.white)
                        .frame(minWidth: 20, minHeight: 20)
                        .background(.red, in: Capsule())
                        .offset(x: 4, y: -4) // nudge past the corner
                }
            }
    }
}
