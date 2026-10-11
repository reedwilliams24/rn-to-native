class ProfileViewModel(private val api: Api) : ViewModel() { // @link:model
    private val _profile = MutableStateFlow<Profile?>(null) // @link:state
    val profile: StateFlow<Profile?> = _profile.asStateFlow()

    // No `await` keyword: calling a suspend fun waits for its result
    suspend fun loadProfile(userId: String): Profile { // @link:load
        val user = api.getUser(userId) // @link:user
        val avatar = api.getAvatar(user.avatarId) // @link:avatar
        return Profile(name = user.name, avatarUrl = avatar.url) // @link:result
    }

    // A regular fun starts a coroutine to call suspend code
    fun refresh(userId: String) { // @link:refresh
        viewModelScope.launch { // @link:refresh
            try { // @link:try
                _profile.value = loadProfile(userId) // @link:assign
            } catch (e: IOException) { // @link:catch
                Log.w("Profile", "Profile failed", e) // @link:log
            }
        }
    }
}
