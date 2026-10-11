// Localizable.xcstrings (a String Catalog) is filled in by Xcode on each build: // @link:file
//   "Hello, %@" // @link:greeting-str
//   "%lld todos"  → Vary by Plural: one = "%lld todo", other = "%lld todos" // @link:plural-str

struct Header: View { // @link:fn
    let name: String
    let count: Int

    var body: some View {
        VStack {
            // String literals in Text are LocalizedStringKeys: these are looked up // @link:lib
            Text("Hello, \(name)") // @link:greeting
            Text("\(count) todos") // @link:plural
        }
    }
}

// Outside views: String(localized: "Hello, \(name)") // @link:outside
