// Localizable.xcstrings (a String Catalog) is filled in by Xcode on each build:
//   "Hello, %@"
//   "%lld todos"  → Vary by Plural: one = "%lld todo", other = "%lld todos"

struct Header: View {
    let name: String
    let count: Int

    var body: some View {
        VStack {
            // String literals in Text are LocalizedStringKeys: these are looked up
            Text("Hello, \(name)")
            Text("\(count) todos")
        }
    }
}

// Outside views: String(localized: "Hello, \(name)")
