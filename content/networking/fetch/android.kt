// Retrofit: describe the API as an interface, get an implementation generated
interface TodoApi {
    @GET("todos")
    suspend fun getTodos(): List<Todo>

    @GET("todos/{id}")
    suspend fun getTodo(@Path("id") id: String): Todo

    @POST("todos")
    suspend fun createTodo(@Body input: NewTodo): Todo
}

val todoApi: TodoApi = Retrofit.Builder()
    .baseUrl("https://api.example.com/") // must end with "/"
    .addConverterFactory(ApiJson.asConverterFactory("application/json".toMediaType()))
    .build()
    .create()

// Usage, from a coroutine: val todos = todoApi.getTodos()
