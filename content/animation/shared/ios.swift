struct PhotoToggle: View {
    @Namespace private var namespace // @link:layout
    @State private var expanded = false

    var body: some View {
        VStack {
            if expanded {
                RoundedRectangle(cornerRadius: 0)
                    .fill(.blue)
                    .matchedGeometryEffect(id: "photo", in: namespace) // @link:tag,large
                    .aspectRatio(1, contentMode: .fit) // @link:large
            } else {
                RoundedRectangle(cornerRadius: 12) // @link:small
                    .fill(.blue)
                    .matchedGeometryEffect(id: "photo", in: namespace) // @link:tag,small
                    .frame(width: 64, height: 64) // @link:small
            }
        }
        .onTapGesture {
            withAnimation(.snappy) { expanded.toggle() } // @link:toggle
        }
    }
}

// Across a NavigationStack push (iOS 18+):
// source:      .matchedTransitionSource(id: todo.id, in: namespace)
// destination: .navigationTransition(.zoom(sourceID: todo.id, in: namespace))
