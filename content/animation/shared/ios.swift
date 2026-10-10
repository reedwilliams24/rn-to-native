struct PhotoToggle: View {
    @Namespace private var namespace
    @State private var expanded = false

    var body: some View {
        VStack {
            if expanded {
                RoundedRectangle(cornerRadius: 0)
                    .fill(.blue)
                    .matchedGeometryEffect(id: "photo", in: namespace)
                    .aspectRatio(1, contentMode: .fit)
            } else {
                RoundedRectangle(cornerRadius: 12)
                    .fill(.blue)
                    .matchedGeometryEffect(id: "photo", in: namespace)
                    .frame(width: 64, height: 64)
            }
        }
        .onTapGesture {
            withAnimation(.snappy) { expanded.toggle() }
        }
    }
}

// Across a NavigationStack push (iOS 18+):
// source:      .matchedTransitionSource(id: todo.id, in: namespace)
// destination: .navigationTransition(.zoom(sourceID: todo.id, in: namespace))
