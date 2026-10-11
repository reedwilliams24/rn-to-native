function NameField() { // @link:fn
  const [name, setName] = useState(''); // @link:state
  return <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />; // @link:field,value,change,label,style
}
