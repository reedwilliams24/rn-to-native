// No permission needed: PhotosPicker runs out of process.
struct AttachPhoto: View {
    let onPicked: (Data) -> Void
    @State private var selection: PhotosPickerItem?

    var body: some View {
        PhotosPicker("Attach photo", selection: $selection, matching: .images)
            .onChange(of: selection) { _, item in
                guard let item else { return }
                Task {
                    if let data = try? await item.loadTransferable(type: Data.self) {
                        onPicked(data)
                    }
                }
            }
    }
}
