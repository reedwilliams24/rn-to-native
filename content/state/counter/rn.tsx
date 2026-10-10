function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Button title="−" onPress={() => setCount((c) => c - 1)} />
      <Text>{count}</Text>
      <Button title="+" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}
