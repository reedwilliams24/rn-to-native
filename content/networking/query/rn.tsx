function TodoScreen() {
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 30_000, // reuse cached data for 30s
  });

  if (isLoading) return <ActivityIndicator />;
  if (error && !data) return <ErrorView onRetry={refetch} />;
  return (
    <FlatList
      data={data}
      refreshing={isRefetching}
      onRefresh={refetch}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}
