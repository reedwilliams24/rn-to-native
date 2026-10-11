enum class SortOrder { Newest, Oldest, Title } // @link:type

// One DataStore per file, created once per process
val Context.settingsStore by preferencesDataStore(name = "settings") // @link:store

class SettingsRepository(private val context: Context) { // @link:store
    private val sortKey = stringPreferencesKey("sort_order") // @link:key

    // Reads are a Flow: it emits the current value, then every change
    val sortOrder: Flow<SortOrder> = context.settingsStore.data // @link:read
        .map { prefs -> SortOrder.entries.find { it.name == prefs[sortKey] } ?: SortOrder.Newest } // @link:read,default

    suspend fun setSortOrder(order: SortOrder) { // @link:write
        context.settingsStore.edit { prefs -> prefs[sortKey] = order.name } // @link:write
    }
}
