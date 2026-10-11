type Props = { email: string; onChangeEmail: (v: string) => void; onSubmit: () => void }; // @link:props

function EmailField({ email, onChangeEmail, onSubmit }: Props) { // @link:fn
  return (
    <TextInput // @link:field
      value={email} // @link:value
      onChangeText={onChangeEmail} // @link:value
      placeholder="Email" // @link:label
      keyboardType="email-address" // @link:kbtype
      autoComplete="email" // @link:autocomplete
      autoCapitalize="none" // @link:caps
      autoCorrect={false} // @link:correct
      returnKeyType="go" // @link:return
      onSubmitEditing={onSubmit} // @link:submit
    />
  );
}
