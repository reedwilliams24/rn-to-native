// Jest swaps the whole module at import time
import { fetchTodos } from './api';
import { loadTodoTitles } from './todoService';

jest.mock('./api');
const mockFetchTodos = jest.mocked(fetchTodos);

it('returns titles from the API', async () => {
  mockFetchTodos.mockResolvedValue([{ id: '1', title: 'Buy milk', done: false }]);

  await expect(loadTodoTitles()).resolves.toEqual(['Buy milk']);
  expect(mockFetchTodos).toHaveBeenCalledTimes(1);
});
