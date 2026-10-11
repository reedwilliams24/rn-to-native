class AuthInterceptor(private val tokens: TokenStore) : Interceptor { // @link:intercept
    // Runs on an OkHttp background thread, synchronously, for every request
    override fun intercept(chain: Interceptor.Chain): Response { // @link:intercept
        val token = tokens.accessToken() // @link:token
        val request = chain.request().newBuilder().apply {
            if (token != null) header("Authorization", "Bearer $token") // @link:header
        }.build()
        return chain.proceed(request) // @link:proceed
    }
}

fun buildTodoApi(tokens: TokenStore): TodoApi { // @link:client
    val client = OkHttpClient.Builder() // @link:client
        .addInterceptor(AuthInterceptor(tokens)) // @link:intercept
        .callTimeout(10, TimeUnit.SECONDS) // @link:timeout
        .build()

    return Retrofit.Builder()
        .baseUrl("https://api.example.com/") // @link:base
        .client(client)
        .addConverterFactory(ApiJson.asConverterFactory("application/json".toMediaType()))
        .build()
        .create()
}
