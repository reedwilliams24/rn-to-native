// e2e/addTodo.test.ts (Detox) // @link:file
describe('Adding a todo', () => { // @link:suite
  beforeAll(async () => { // @link:launch
    await device.launchApp({ newInstance: true }); // @link:launch
  });

  it('shows the new todo in the list', async () => { // @link:test
    await element(by.id('new-todo-input')).typeText('Buy milk'); // @link:type
    await element(by.id('add-todo')).tap(); // @link:tap

    await expect(element(by.text('Buy milk'))).toBeVisible(); // @link:assert
  });
});

// In the app: <TextInput testID="new-todo-input" /> // @link:tag
