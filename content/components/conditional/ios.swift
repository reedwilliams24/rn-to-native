struct TodoStatus: View {
    let done: Bool
    var dueDate: String? = nil

    var body: some View {
        VStack {
            if done { Text("Done") } else { Text("Open") }

            if let dueDate {
                Text("Due \(dueDate)")
            }
        }
    }
}
