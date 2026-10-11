struct DraggableCard: View { // @link:fn
    @State private var offset = CGSize.zero // @link:offset

    var body: some View {
        RoundedRectangle(cornerRadius: 16) // @link:card
            .fill(.tint)
            .frame(width: 120, height: 120)
            .offset(offset) // @link:apply
            .gesture( // @link:gesture
                DragGesture() // @link:gesture
                    .onChanged { value in // @link:update
                        offset = value.translation // @link:update
                    }
                    .onEnded { _ in // @link:end
                        withAnimation(.spring) { offset = .zero } // @link:end
                    }
            )
    }
}
