async function loadProfile(userId: string): Promise<Profile> {
  const user = await api.getUser(userId);
  const avatar = await api.getAvatar(user.avatarId);
  return { name: user.name, avatarUrl: avatar.url };
}

async function refresh(userId: string) {
  try {
    setProfile(await loadProfile(userId));
  } catch (e) {
    console.warn('Profile failed', e);
  }
}
