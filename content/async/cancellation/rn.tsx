function SearchResults({ query }: { query: string }) { // @link:fn
  const [results, setResults] = useState<Todo[]>([]); // @link:state

  useEffect(() => { // @link:effect
    const controller = new AbortController(); // @link:cancel
    const timer = setTimeout(async () => { // @link:debounce
      try {
        setResults(await api.search(query, { signal: controller.signal })); // @link:search
      } catch (e) { // @link:catch
        if (!controller.signal.aborted) console.warn(e); // @link:catch
      }
    }, 300); // @link:debounce
    return () => { // @link:cancel
      clearTimeout(timer);
      controller.abort(); // @link:cancel
    };
  }, [query]); // @link:effect

  return <FlatList data={results} renderItem={({ item }) => <Text>{item.title}</Text>} />; // @link:list
}
