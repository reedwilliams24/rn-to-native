function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  return (
    <View>
      <TextInput
        autoFocus
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <TextInput
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={() => {
          Keyboard.dismiss();
          onLogin();
        }}
      />
    </View>
  );
}
