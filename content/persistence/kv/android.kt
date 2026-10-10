enum class SortOrder { Newest, Oldest, Title }

// One DataStore per file, created once per process
val Context.settingsStore by preferencesDataStore(name = "settings")

class SettingsRepository(private val context: Context) {
    private val sortKey = stringPreferencesKey("sort_order")

    // Reads are a Flow: it emits the current value, then every change
    val sortOrder: Flow<SortOrder> = context.settingsStore.data
        .map { prefs -> SortOrder.entries.find { it.name == prefs[sortKey] } ?: SortOrder.Newest }

    suspend fun setSortOrder(order: SortOrder) {
        context.settingsStore.edit { prefs -> prefs[sortKey] = order.name }
    }
}
