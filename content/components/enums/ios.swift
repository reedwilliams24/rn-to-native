enum Priority { case low, medium, high }

struct PriorityBadge: View {
    let priority: Priority

    var body: some View {
        switch priority {
        case .high: Text("High").foregroundStyle(.red)
        case .medium: Text("Medium").foregroundStyle(.orange)
        case .low: Text("Low").foregroundStyle(.gray)
        }
    }
}
