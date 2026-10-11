import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useTodoList } from './useTodoList';

const repo = { load: jest.fn() }; // @link:fake

it('refresh shows loaded todos', async () => { // @link:ok-test
  repo.load.mockResolvedValue([{ id: '1', title: 'Buy milk' }]); // @link:fake-ok
  const { result } = renderHook(() => useTodoList(repo)); // @link:create-ok

  act(() => result.current.refresh()); // @link:refresh-ok

  await waitFor(() => // @link:wait-ok
    expect(result.current.state).toEqual({ // @link:assert-ok
      status: 'loaded',
      todos: [{ id: '1', title: 'Buy milk' }],
    }),
  );
  expect(repo.load).toHaveBeenCalledTimes(1); // @link:calls
});

it('a network failure shows an error', async () => { // @link:err-test
  repo.load.mockRejectedValue(new Error('offline')); // @link:fake-err
  const { result } = renderHook(() => useTodoList(repo)); // @link:create-err

  act(() => result.current.refresh()); // @link:refresh-err

  await waitFor(() => expect(result.current.state.status).toBe('error')); // @link:wait-err,assert-err
});
