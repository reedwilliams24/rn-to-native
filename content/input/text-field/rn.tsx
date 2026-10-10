function NameField() {
  const [name, setName] = useState('');
  return <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />;
}
