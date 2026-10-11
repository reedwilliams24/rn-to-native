function LikeButton({ liked, onToggle }: {
  liked: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      title={liked ? "Liked" : "Like"}
      onPress={onToggle}
    />
  );
}

function Post() {
  const [liked, setLiked] = useState(false);
  return (
    <LikeButton
      liked={liked}
      onToggle={() => setLiked(!liked)}
    />
  );
}
