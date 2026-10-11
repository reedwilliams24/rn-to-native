// OkHttp calls authenticate() when a response is 401 // @link:hook
class TokenAuthenticator( // @link:hook
    private val tokens: TokenStore,
    private val authApi: AuthApi, // built on a client *without* this authenticator
) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? { // @link:hook
        if (response.priorResponse != null) return null // already retried once: give up // @link:guard

        val fresh = synchronized(this) { // @link:inflight
            val sent = response.request.header("Authorization")?.removePrefix("Bearer ")
            val current = tokens.accessToken()
            if (current != null && current != sent) {
                current // another request refreshed while this one waited // @link:join
            } else {
                val refreshToken = tokens.refreshToken() ?: return null
                val pair = try {
                    runBlocking { authApi.refresh(RefreshRequest(refreshToken)) } // @link:refresh
                } catch (e: Exception) {
                    return null // refresh failed: let the 401 through and log out
                }
                tokens.save(pair) // @link:save
                pair.accessToken
            }
        }

        return response.request.newBuilder() // @link:retry
            .header("Authorization", "Bearer $fresh") // @link:retry
            .build()
    }
}
// OkHttpClient.Builder().authenticator(TokenAuthenticator(tokens, authApi))
