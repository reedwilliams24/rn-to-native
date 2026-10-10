type Props = { email: string; onChangeEmail: (v: string) => void; onSubmit: () => void };

function EmailField({ email, onChangeEmail, onSubmit }: Props) {
  return (
    <TextInput
      value={email}
      onChangeText={onChangeEmail}
      placeholder="Email"
      keyboardType="email-address"
      autoComplete="email"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="go"
      onSubmitEditing={onSubmit}
    />
  );
}
