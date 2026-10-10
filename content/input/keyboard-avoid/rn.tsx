function ChatScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MessageList style={{ flex: 1 }} />
      <Composer />
    </KeyboardAvoidingView>
  );
}
