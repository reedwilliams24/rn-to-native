interface TodoRepository { // @link:iface
    suspend fun list(): List<Todo> // @link:list
}

class HttpTodoRepository @Inject constructor( // @link:impl
    private val api: TodoApi,
) : TodoRepository {
    override suspend fun list() = api.todos()
}

// Tells Hilt: "when someone asks for TodoRepository, give them HttpTodoRepository" // @link:inject
@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {
    @Binds
    @Singleton
    abstract fun bindTodoRepository(impl: HttpTodoRepository): TodoRepository // @link:bind
}

@HiltViewModel
class TodoViewModel @Inject constructor( // @link:consumer
    private val repo: TodoRepository, // @link:consumer
) : ViewModel()

@Composable
fun TodoScreen(viewModel: TodoViewModel = hiltViewModel()) { // @link:resolve
    // …
}
