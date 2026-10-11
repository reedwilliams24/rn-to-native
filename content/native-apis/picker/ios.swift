// No permission needed: PhotosPicker runs out of process. // @link:noperm
struct AttachPhoto: View { // @link:fn
    let onPicked: (Data) -> Void
    @State private var selection: PhotosPickerItem? // @link:import

    var body: some View {
        PhotosPicker("Attach photo", selection: $selection, matching: .images) // @link:button,launch,images,pick
            .onChange(of: selection) { _, item in // @link:picked
                guard let item else { return }
                Task {
                    if let data = try? await item.loadTransferable(type: Data.self) {
                        onPicked(data) // @link:picked
                    }
                }
            }
    }
}
