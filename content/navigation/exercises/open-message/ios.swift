struct MailApp: View {
    var body: some View {
        /*[*/NavigationStack/*]*/ {
            /*[*/NavigationLink/*]*/("Open", value: "a")
                ./*[*/navigationDestination/*]*/(
                    for: String.self
                ) { id in
                    MessageView(id: id)
                }
        }
    }
}

struct MessageView: View {
    let id: String
    /*[*/@Environment(\.dismiss)/*]*/ private var dismiss

    var body: some View {
        VStack {
            Text("Message \(id)")
            Button("Back") { /*[*/dismiss()/*]*/ }
        }
    }
}
