function PinField() {
  const [pin, setPin] = useState('');
  return (
    <TextInput
      value={pin}
      onChangeText={(text) => setPin(text.replace(/\D/g, '').slice(0, 6))}
      keyboardType="number-pad"
      placeholder="PIN"
    />
  );
}
