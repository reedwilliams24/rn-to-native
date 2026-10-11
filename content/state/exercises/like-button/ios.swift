struct LikeButton: View {
    /*[*/@Binding/*]*/ var liked: Bool

    var body: some View {
        Button(liked ? "Liked" : "Like") {
            /*[*/liked.toggle()/*]*/
        }
    }
}

struct Post: View {
    /*[*/@State/*]*/ private var liked = false

    var body: some View {
        LikeButton(liked: /*[*/$liked/*]*/)
    }
}
