function TodoScreen() { // @link:screen
  const { data, error, isLoading, isRefetching, refetch } = useQuery({ // @link:state,load
    queryKey: ['todos'],
    queryFn: getTodos, // @link:fetch
    staleTime: 30_000, // reuse cached data for 30s // @link:stale
  });

  if (isLoading) return <ActivityIndicator />;
  if (error && !data) return <ErrorView onRetry={refetch} />; // @link:error
  return (
    <FlatList // @link:list
      data={data}
      refreshing={isRefetching} // @link:refreshing
      onRefresh={refetch} // @link:refresh
      renderItem={({ item }) => <Text>{item.title}</Text>} // @link:list
    />
  );
}
