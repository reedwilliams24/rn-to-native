struct Chip: View {
    let label: String

    var body: some View {
        Text(label)
            .font(.system(size: 14, weight: .semibold))
            .foregroundStyle(Color(red: 0.10, green: 0.34, blue: 0.86))
            // inner → outer: padding first, then background around it
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                Color(red: 0.91, green: 0.94, blue: 1.0),
                in: RoundedRectangle(cornerRadius: 16)
            )
    }
}

// Callers style it by chaining more modifiers:
// Chip(label: "Work").padding(.top, 8)
