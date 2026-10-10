function AddTodo() {
  const [adding, setAdding] = useState(false);

  return (
    <>
      <Button title="New todo" onPress={() => setAdding(true)} />
      <Modal
        visible={adding}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAdding(false)}
      >
        <NewTodoForm onDone={() => setAdding(false)} />
      </Modal>
    </>
  );
}
