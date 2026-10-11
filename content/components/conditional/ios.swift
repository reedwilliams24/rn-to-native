struct TodoStatus: View { // @link:fn,props
    let done: Bool // @link:done
    var dueDate: String? = nil // @link:due

    var body: some View { // @link:body
        VStack { // @link:column
            if done { Text("Done") } else { Text("Open") } // @link:if-else

            if let dueDate { // @link:optional
                Text("Due \(dueDate)") // @link:optional
            }
        }
    }
}
