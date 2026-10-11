type Props = { todos: Todo[]; loading: boolean; loadMore: () => void }; // @link:props

function InfiniteList({ todos, loading, loadMore }: Props) { // @link:fn
  return (
    <FlatList // @link:list
      data={todos} // @link:items
      keyExtractor={(t) => t.id} // @link:items
      renderItem={({ item }) => <TodoRow todo={item} />} // @link:row
      onEndReached={loadMore} // @link:trigger
      onEndReachedThreshold={0.5} // @link:threshold
      ListFooterComponent={loading ? <ActivityIndicator /> : null} // @link:footer
    />
  );
}
