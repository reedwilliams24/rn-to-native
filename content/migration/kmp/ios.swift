// The KMP module compiles to an Apple framework named "Shared"
import Shared
import SwiftUI

struct TitleField: View {
    @Binding var title: String

    var body: some View {
        // Kotlin `object` → `.shared`; parameter names become argument labels
        let error = TodoRules.shared.validateTitle(title: title)

        VStack(alignment: .leading) {
            TextField("Title", text: $title)
            if let error {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(.red)
            }
        }
    }
}
