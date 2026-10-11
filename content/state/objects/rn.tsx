type Todo = { id: string; title: string; done: boolean }; // @link:type

function Todos() { // @link:fn
  const [todos, setTodos] = useState<Todo[]>([]); // @link:state

  const add = (title: string) => // @link:add
    setTodos((prev) => [...prev, { id: uuid(), title, done: false }]); // @link:add
  const toggle = (id: string) => // @link:toggle
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); // @link:toggle

  return (
    <View>{/* @link:container */}
      {todos.map((t) => ( // @link:foreach
        <Pressable key={t.id} onPress={() => toggle(t.id)}>{/* @link:row */}
          <Text>{t.done ? '☑' : '☐'} {t.title}</Text>{/* @link:item */}
        </Pressable>
      ))}
      <Button title="Add" onPress={() => add('New todo')} />{/* @link:addbtn */}
    </View>
  );
}
