function SignUp({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const valid = email.includes('@');
  const error = submitted && !valid ? 'Enter a valid email' : null;

  return (
    <View style={{ gap: 8 }}>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button
        title="Sign up"
        onPress={() => {
          setSubmitted(true);
          if (valid) onSubmit(email);
        }}
      />
    </View>
  );
}
