function SubmitButton({ onSubmit }: { onSubmit: () => void }) { // @link:fn
  const lastTap = useRef(0); // writing .current doesn't re-render // @link:ref

  return (
    <Button // @link:button
      title="Submit" // @link:label
      onPress={() => { // @link:press
        const now = Date.now(); // @link:now
        if (now - lastTap.current >= 1000) { // @link:check
          lastTap.current = now; // @link:write
          onSubmit(); // @link:call
        }
      }}
    />
  );
}
