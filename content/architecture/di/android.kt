interface TodoRepository {
    suspend fun list(): List<Todo>
}

class HttpTodoRepository @Inject constructor(
    private val api: TodoApi,
) : TodoRepository {
    override suspend fun list() = api.todos()
}

// Tells Hilt: "when someone asks for TodoRepository, give them HttpTodoRepository"
@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {
    @Binds
    @Singleton
    abstract fun bindTodoRepository(impl: HttpTodoRepository): TodoRepository
}

@HiltViewModel
class TodoViewModel @Inject constructor(
    private val repo: TodoRepository,
) : ViewModel()

@Composable
fun TodoScreen(viewModel: TodoViewModel = hiltViewModel()) {
    // …
}
