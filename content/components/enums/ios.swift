enum Priority { case low, medium, high } // @link:enum

struct PriorityBadge: View { // @link:fn
    let priority: Priority // @link:param

    var body: some View {
        switch priority { // @link:switch
        case .high: Text("High").foregroundStyle(.red) // @link:high
        case .medium: Text("Medium").foregroundStyle(.orange) // @link:medium
        case .low: Text("Low").foregroundStyle(.gray) // @link:low
        }
    }
}
