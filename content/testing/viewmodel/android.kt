class TodoListViewModelTest {
    @get:Rule
    val mainDispatcher = MainDispatcherRule()

    @Test
    fun `refresh shows loaded todos`() = runTest {
        val repo = FakeTodoRepository(Result.success(listOf(Todo("1", "Buy milk"))))
        val viewModel = TodoListViewModel(repo)

        viewModel.refresh()
        advanceUntilIdle()

        assertEquals(TodoListState.Loaded(listOf(Todo("1", "Buy milk"))), viewModel.state.value)
        assertEquals(1, repo.loadCalls)
    }

    @Test
    fun `a network failure shows an error`() = runTest {
        val viewModel = TodoListViewModel(FakeTodoRepository(Result.failure(IOException("offline"))))

        viewModel.refresh()
        advanceUntilIdle()

        assertEquals(TodoListState.Error("Couldn't load todos"), viewModel.state.value)
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
