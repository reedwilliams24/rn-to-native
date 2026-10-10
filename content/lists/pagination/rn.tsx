type Props = { todos: Todo[]; loading: boolean; loadMore: () => void };

function InfiniteList({ todos, loading, loadMore }: Props) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TodoRow todo={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator /> : null}
    />
  );
}
