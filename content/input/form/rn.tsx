function SignUp({ onSubmit }: { onSubmit: (email: string) => void }) { // @link:fn
  const [email, setEmail] = useState(''); // @link:email
  const [submitted, setSubmitted] = useState(false); // @link:submitted
  const valid = email.includes('@'); // @link:valid
  const error = submitted && !valid ? 'Enter a valid email' : null; // @link:error

  return (
    <View style={{ gap: 8 }}>{/* @link:container */}
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />{/* @link:field */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}{/* @link:errortext */}
      <Button // @link:button
        title="Sign up" // @link:button
        onPress={() => {
          setSubmitted(true); // @link:submit
          if (valid) onSubmit(email); // @link:send
        }}
      />
    </View>
  );
}
