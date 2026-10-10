function SubmitButton({ onSubmit }: { onSubmit: () => void }) {
  const lastTap = useRef(0); // writing .current doesn't re-render

  return (
    <Button
      title="Submit"
      onPress={() => {
        const now = Date.now();
        if (now - lastTap.current >= 1000) {
          lastTap.current = now;
          onSubmit();
        }
      }}
    />
  );
}
