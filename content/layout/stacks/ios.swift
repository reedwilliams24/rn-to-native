struct ProfileHeader: View {
    let name: String
    let handle: String

    var body: some View {
        HStack(spacing: 12) { // alignment defaults to .center
            Circle()
                .fill(.gray)
                .frame(width: 48, height: 48)
            VStack(alignment: .leading) { // default would be .center
                Text(name).fontWeight(.semibold)
                Text("@\(handle)").foregroundStyle(.secondary)
            }
        }
    }
}
