class ProfileViewModel(private val api: Api) : ViewModel() {
    private val _profile = MutableStateFlow<Profile?>(null)
    val profile: StateFlow<Profile?> = _profile.asStateFlow()

    // No `await` keyword: calling a suspend fun waits for its result
    suspend fun loadProfile(userId: String): Profile {
        val user = api.getUser(userId)
        val avatar = api.getAvatar(user.avatarId)
        return Profile(name = user.name, avatarUrl = avatar.url)
    }

    // A regular fun starts a coroutine to call suspend code
    fun refresh(userId: String) {
        viewModelScope.launch {
            try {
                _profile.value = loadProfile(userId)
            } catch (e: IOException) {
                Log.w("Profile", "Profile failed", e)
            }
        }
    }
}
