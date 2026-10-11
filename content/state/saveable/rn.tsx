function SearchScreen() { // @link:fn
  // RN's Android template opts out of Activity recreation (configChanges in // @link:rotation
  // the manifest), so useState survives rotation. Process death still wipes it.
  const [query, setQuery] = useState(''); // @link:state

  return <TextInput value={query} onChangeText={setQuery} placeholder="Search" />; // @link:field
}
