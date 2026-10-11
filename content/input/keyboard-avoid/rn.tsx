function ChatScreen() { // @link:fn
  return (
    <KeyboardAvoidingView // @link:avoid
      style={{ flex: 1 }} // @link:fill
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // @link:avoid
    >
      <MessageList style={{ flex: 1 }} />{/* @link:list */}
      <Composer />{/* @link:composer */}
    </KeyboardAvoidingView>
  );
}
