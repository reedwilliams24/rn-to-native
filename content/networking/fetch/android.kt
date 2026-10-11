// Retrofit: describe the API as an interface, get an implementation generated
interface TodoApi { // @link:api
    @GET("todos") // @link:get,get-req
    suspend fun getTodos(): List<Todo> // @link:get

    @GET("todos/{id}")
    suspend fun getTodo(@Path("id") id: String): Todo

    @POST("todos") // @link:post,create-req
    suspend fun createTodo(@Body input: NewTodo): Todo // @link:create,body
}

val todoApi: TodoApi = Retrofit.Builder()
    .baseUrl("https://api.example.com/") // must end with "/" // @link:base
    .addConverterFactory(ApiJson.asConverterFactory("application/json".toMediaType())) // @link:decode,ctype
    .build()
    .create()

// Usage, from a coroutine: val todos = todoApi.getTodos()
