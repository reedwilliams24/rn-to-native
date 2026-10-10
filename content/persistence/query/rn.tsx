function TodoList() {
  const [todos, setTodos] = useState<TodoRow[]>([]);
  const reload = useCallback(() => listTodos().then(setTodos), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = async (title: string) => {
    await addTodo(title);
    reload(); // nothing tells the UI that the table changed
  };

  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => String(t.id)}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      ListFooterComponent={<Button title="Add" onPress={() => add('New todo')} />}
    />
  );
}
