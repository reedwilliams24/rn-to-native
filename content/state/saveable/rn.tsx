function SearchScreen() {
  // RN's Android template opts out of Activity recreation (configChanges in
  // the manifest), so useState survives rotation. Process death still wipes it.
  const [query, setQuery] = useState('');

  return <TextInput value={query} onChangeText={setQuery} placeholder="Search" />;
}
