function Feed({ onRefresh }: { onRefresh: () => void }) { // @link:fn
  useEffect(() => { // @link:effect
    const sub = AppState.addEventListener('change', (state) => { // @link:listen
      if (state === 'active') onRefresh(); // @link:active
    });
    return () => sub.remove();
  }, [onRefresh]); // @link:effect

  return <FeedList />; // @link:content
}
