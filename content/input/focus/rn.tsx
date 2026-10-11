function LoginForm({ onLogin }: { onLogin: () => void }) { // @link:fn
  const [email, setEmail] = useState(''); // @link:email-state
  const [password, setPassword] = useState(''); // @link:pw-state
  const passwordRef = useRef<TextInput>(null); // @link:focusref,email-field

  return (
    <View>{/* @link:container */}
      <TextInput // @link:pw-field
        autoFocus // @link:autofocus
        value={email} // @link:email-field
        onChangeText={setEmail} // @link:email-field
        returnKeyType="next" // @link:next
        onSubmitEditing={() => passwordRef.current?.focus()} // @link:focus-next
      />
      <TextInput
        ref={passwordRef} // @link:focusref
        value={password} // @link:pw-field
        onChangeText={setPassword} // @link:pw-field
        secureTextEntry // @link:secure
        returnKeyType="done" // @link:done
        onSubmitEditing={() => { // @link:submit
          Keyboard.dismiss(); // @link:dismiss
          onLogin(); // @link:login
        }}
      />
    </View>
  );
}
