import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useTodoList } from './useTodoList';

const repo = { load: jest.fn() };

it('refresh shows loaded todos', async () => {
  repo.load.mockResolvedValue([{ id: '1', title: 'Buy milk' }]);
  const { result } = renderHook(() => useTodoList(repo));

  act(() => result.current.refresh());

  await waitFor(() =>
    expect(result.current.state).toEqual({
      status: 'loaded',
      todos: [{ id: '1', title: 'Buy milk' }],
    }),
  );
  expect(repo.load).toHaveBeenCalledTimes(1);
});

it('a network failure shows an error', async () => {
  repo.load.mockRejectedValue(new Error('offline'));
  const { result } = renderHook(() => useTodoList(repo));

  act(() => result.current.refresh());

  await waitFor(() => expect(result.current.state.status).toBe('error'));
});
