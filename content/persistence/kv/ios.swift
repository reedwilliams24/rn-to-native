enum SortOrder: String { // @link:type
    case newest, oldest, title
}

struct SettingsStore { // @link:store
    private let defaults = UserDefaults.standard // @link:store
    private let sortKey = "settings.sortOrder" // @link:key

    // Synchronous: UserDefaults keeps an in-memory copy and saves in the background
    var sortOrder: SortOrder { // @link:read,write
        get { defaults.string(forKey: sortKey).flatMap(SortOrder.init(rawValue:)) ?? .newest } // @link:read,default
        nonmutating set { defaults.set(newValue.rawValue, forKey: sortKey) } // @link:write
    }
}
