struct Chip: View { // @link:fn,props
    let label: String // @link:label

    var body: some View { // @link:body
        Text(label) // @link:text
            .font(.system(size: 14, weight: .semibold)) // @link:font
            .foregroundStyle(Color(red: 0.10, green: 0.34, blue: 0.86)) // @link:color
            // inner → outer: padding first, then background around it
            .padding(.horizontal, 12) // @link:padding
            .padding(.vertical, 6) // @link:padding
            .background( // @link:background
                Color(red: 0.91, green: 0.94, blue: 1.0), // @link:background
                in: RoundedRectangle(cornerRadius: 16) // @link:background
            )
    }
}

// Callers style it by chaining more modifiers: // @link:style-param
// Chip(label: "Work").padding(.top, 8) // @link:style-param
