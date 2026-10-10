struct TagList: View {
    let tags: [String]

    var body: some View {
        HStack(spacing: 8) {
            ForEach(tags, id: \.self) { tag in
                Text("#\(tag)")
            }
        }
    }
}
