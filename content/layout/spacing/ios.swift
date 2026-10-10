struct InfoCard: View {
    let title: String
    let text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) { // gap
            Text(title).font(.headline)
            Text(text).foregroundStyle(.secondary)
            Text("Read more")
                .foregroundStyle(.tint)
                .padding(.top, 12) // marginTop
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16) // padding: inside the background
        .background(Color(.secondarySystemBackground), in: .rect(cornerRadius: 12))
        .padding(16) // "margin": outside the background
    }
}
