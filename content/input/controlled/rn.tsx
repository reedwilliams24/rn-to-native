function PinField() { // @link:fn
  const [pin, setPin] = useState(''); // @link:state
  return (
    <TextInput // @link:field
      value={pin} // @link:value
      onChangeText={(text) => setPin(text.replace(/\D/g, '').slice(0, 6))} // @link:filter
      keyboardType="number-pad" // @link:kb
      placeholder="PIN" // @link:label
    />
  );
}
