type Todo = { id: string; title: string; done: boolean };

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const add = (title: string) =>
    setTodos((prev) => [...prev, { id: uuid(), title, done: false }]);
  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <View>
      {todos.map((t) => (
        <Pressable key={t.id} onPress={() => toggle(t.id)}>
          <Text>{t.done ? '☑' : '☐'} {t.title}</Text>
        </Pressable>
      ))}
      <Button title="Add" onPress={() => add('New todo')} />
    </View>
  );
}
