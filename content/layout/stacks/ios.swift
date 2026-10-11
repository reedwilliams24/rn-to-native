struct ProfileHeader: View { // @link:fn
    let name: String // @link:fn
    let handle: String // @link:fn

    var body: some View {
        HStack(spacing: 12) { // alignment defaults to .center // @link:row
            Circle() // @link:avatar
                .fill(.gray) // @link:avatar
                .frame(width: 48, height: 48) // @link:avatar
            VStack(alignment: .leading) { // default would be .center // @link:col
                Text(name).fontWeight(.semibold) // @link:name
                Text("@\(handle)").foregroundStyle(.secondary) // @link:handle
            }
        }
    }
}
