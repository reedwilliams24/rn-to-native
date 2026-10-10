function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<Todo[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setResults(await api.search(query, { signal: controller.signal }));
      } catch (e) {
        if (!controller.signal.aborted) console.warn(e);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return <FlatList data={results} renderItem={({ item }) => <Text>{item.title}</Text>} />;
}
