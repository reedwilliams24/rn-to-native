function Feed({ todos, reload }: { todos: Todo[]; reload: () => Promise<void> }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TodoRow todo={item} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
