function TodoList() { // @link:screen
  const [todos, setTodos] = useState<TodoRow[]>([]); // @link:todos
  const reload = useCallback(() => listTodos().then(setTodos), []); // @link:query

  useEffect(() => { // @link:query
    reload();
  }, [reload]);

  const add = async (title: string) => { // @link:add
    await addTodo(title); // @link:add
    reload(); // nothing tells the UI that the table changed // @link:reload
  };

  return (
    <FlatList // @link:list
      data={todos}
      keyExtractor={(t) => String(t.id)}
      renderItem={({ item }) => <Text>{item.title}</Text>} // @link:row
      ListFooterComponent={<Button title="Add" onPress={() => add('New todo')} />} // @link:addbtn
    />
  );
}
