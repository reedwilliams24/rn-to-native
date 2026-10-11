// Jest swaps the whole module at import time // @link:fake
import { fetchTodos } from './api';
import { loadTodoTitles } from './todoService';

jest.mock('./api'); // @link:fake
const mockFetchTodos = jest.mocked(fetchTodos); // @link:fake

it('returns titles from the API', async () => {
  mockFetchTodos.mockResolvedValue([{ id: '1', title: 'Buy milk', done: false }]); // @link:result

  await expect(loadTodoTitles()).resolves.toEqual(['Buy milk']);
  expect(mockFetchTodos).toHaveBeenCalledTimes(1); // @link:calls
});
