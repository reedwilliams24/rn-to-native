struct InfoCard: View { // @link:fn
    let title: String
    let text: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) { // gap // @link:card,gap
            Text(title).font(.headline) // @link:title
            Text(text).foregroundStyle(.secondary) // @link:text
            Text("Read more") // @link:link
                .foregroundStyle(.tint)
                .padding(.top, 12) // marginTop // @link:margintop
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16) // padding: inside the background // @link:padding
        .background(Color(.secondarySystemBackground), in: .rect(cornerRadius: 12)) // @link:bg
        .padding(16) // "margin": outside the background // @link:margin
    }
}
