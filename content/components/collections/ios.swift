struct TagList: View { // @link:fn
    let tags: [String] // @link:param

    var body: some View { // @link:body
        HStack(spacing: 8) { // @link:row
            ForEach(tags, id: \.self) { tag in // @link:loop,key
                Text("#\(tag)") // @link:item
            }
        }
    }
}
