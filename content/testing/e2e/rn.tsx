// e2e/addTodo.test.ts (Detox)
describe('Adding a todo', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('shows the new todo in the list', async () => {
    await element(by.id('new-todo-input')).typeText('Buy milk');
    await element(by.id('add-todo')).tap();

    await expect(element(by.text('Buy milk'))).toBeVisible();
  });
});

// In the app: <TextInput testID="new-todo-input" />
