class AuthInterceptor(private val tokens: TokenStore) : Interceptor {
    // Runs on an OkHttp background thread, synchronously, for every request
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = tokens.accessToken()
        val request = chain.request().newBuilder().apply {
            if (token != null) header("Authorization", "Bearer $token")
        }.build()
        return chain.proceed(request)
    }
}

fun buildTodoApi(tokens: TokenStore): TodoApi {
    val client = OkHttpClient.Builder()
        .addInterceptor(AuthInterceptor(tokens))
        .callTimeout(10, TimeUnit.SECONDS)
        .build()

    return Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .client(client)
        .addConverterFactory(ApiJson.asConverterFactory("application/json".toMediaType()))
        .build()
        .create()
}
