enum SortOrder: String {
    case newest, oldest, title
}

struct SettingsStore {
    private let defaults = UserDefaults.standard
    private let sortKey = "settings.sortOrder"

    // Synchronous: UserDefaults keeps an in-memory copy and saves in the background
    var sortOrder: SortOrder {
        get { defaults.string(forKey: sortKey).flatMap(SortOrder.init(rawValue:)) ?? .newest }
        nonmutating set { defaults.set(newValue.rawValue, forKey: sortKey) }
    }
}
