function Counter() { // @link:fn
  const [count, setCount] = useState(0); // @link:state
  return ( // @link:body
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>{/* @link:row */}
      <Button title="−" onPress={() => setCount((c) => c - 1)} />{/* @link:dec */}
      <Text>{count}</Text>{/* @link:text */}
      <Button title="+" onPress={() => setCount((c) => c + 1)} />{/* @link:inc */}
    </View>
  );
}
