function Feed({ onRefresh }: { onRefresh: () => void }) {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') onRefresh();
    });
    return () => sub.remove();
  }, [onRefresh]);

  return <FeedList />;
}
