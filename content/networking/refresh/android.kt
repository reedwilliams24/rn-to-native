// OkHttp calls authenticate() when a response is 401
class TokenAuthenticator(
    private val tokens: TokenStore,
    private val authApi: AuthApi, // built on a client *without* this authenticator
) : Authenticator {
    override fun authenticate(route: Route?, response: Response): Request? {
        if (response.priorResponse != null) return null // already retried once: give up

        val fresh = synchronized(this) {
            val sent = response.request.header("Authorization")?.removePrefix("Bearer ")
            val current = tokens.accessToken()
            if (current != null && current != sent) {
                current // another request refreshed while this one waited
            } else {
                val refreshToken = tokens.refreshToken() ?: return null
                val pair = try {
                    runBlocking { authApi.refresh(RefreshRequest(refreshToken)) }
                } catch (e: Exception) {
                    return null // refresh failed: let the 401 through and log out
                }
                tokens.save(pair)
                pair.accessToken
            }
        }

        return response.request.newBuilder()
            .header("Authorization", "Bearer $fresh")
            .build()
    }
}
// OkHttpClient.Builder().authenticator(TokenAuthenticator(tokens, authApi))
