function AddTodo() { // @link:fn
  const [adding, setAdding] = useState(false); // @link:state

  return (
    <>
      <Button title="New todo" onPress={() => setAdding(true)} />{/* @link:open */}
      <Modal // @link:modal
        visible={adding} // @link:modal
        animationType="slide"
        presentationStyle="pageSheet" // @link:detents
        onRequestClose={() => setAdding(false)} // @link:dismiss
      >
        <NewTodoForm onDone={() => setAdding(false)} />{/* @link:form */}
      </Modal>
    </>
  );
}
