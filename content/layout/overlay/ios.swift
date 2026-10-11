struct AvatarWithBadge: View { // @link:fn
    let count: Int // @link:fn

    var body: some View {
        Circle() // @link:avatar
            .fill(.gray) // @link:avatar
            .frame(width: 48, height: 48) // @link:avatar
            .overlay(alignment: .topTrailing) { // @link:badge,pos
                if count > 0 { // @link:cond
                    Text("\(count)") // @link:text
                        .font(.caption2) // @link:text
                        .foregroundStyle(.white) // @link:text
                        .frame(minWidth: 20, minHeight: 20) // @link:size
                        .background(.red, in: Capsule()) // @link:bg
                        .offset(x: 4, y: -4) // nudge past the corner // @link:pos
                }
            }
    }
}
