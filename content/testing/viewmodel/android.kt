class TodoListViewModelTest {
    @get:Rule
    val mainDispatcher = MainDispatcherRule()

    @Test
    fun `refresh shows loaded todos`() = runTest { // @link:ok-test
        val repo = FakeTodoRepository(Result.success(listOf(Todo("1", "Buy milk")))) // @link:fake,fake-ok
        val viewModel = TodoListViewModel(repo) // @link:create-ok

        viewModel.refresh() // @link:refresh-ok
        advanceUntilIdle() // @link:wait-ok

        assertEquals(TodoListState.Loaded(listOf(Todo("1", "Buy milk"))), viewModel.state.value) // @link:assert-ok
        assertEquals(1, repo.loadCalls) // @link:calls
    }

    @Test
    fun `a network failure shows an error`() = runTest { // @link:err-test
        val viewModel = TodoListViewModel(FakeTodoRepository(Result.failure(IOException("offline")))) // @link:create-err,fake-err

        viewModel.refresh() // @link:refresh-err
        advanceUntilIdle() // @link:wait-err

        assertEquals(TodoListState.Error("Couldn't load todos"), viewModel.state.value) // @link:assert-err
    }
}

// viewModelScope runs on Dispatchers.Main, which doesn't exist on the JVM.
// This rule swaps in a test dispatcher for each test.
class MainDispatcherRule(
    private val dispatcher: TestDispatcher = UnconfinedTestDispatcher(),
) : TestWatcher() {
    override fun starting(description: Description) = Dispatchers.setMain(dispatcher)
    override fun finished(description: Description) = Dispatchers.resetMain()
}
