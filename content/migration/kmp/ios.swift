// The KMP module compiles to an Apple framework named "Shared" // @link:shared
import Shared // @link:shared
import SwiftUI

struct TitleField: View {
    @Binding var title: String

    var body: some View {
        // Kotlin `object` → `.shared`; parameter names become argument labels
        let error = TodoRules.shared.validateTitle(title: title) // @link:use

        VStack(alignment: .leading) {
            TextField("Title", text: $title) // @link:field
            if let error { // @link:showerr
                Text(error) // @link:showerr
                    .font(.footnote)
                    .foregroundStyle(.red)
            }
        }
    }
}
