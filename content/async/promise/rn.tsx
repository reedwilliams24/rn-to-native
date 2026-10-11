async function loadProfile(userId: string): Promise<Profile> { // @link:load
  const user = await api.getUser(userId); // @link:user
  const avatar = await api.getAvatar(user.avatarId); // @link:avatar
  return { name: user.name, avatarUrl: avatar.url }; // @link:result
}

async function refresh(userId: string) { // @link:refresh
  try { // @link:try
    setProfile(await loadProfile(userId)); // @link:assign
  } catch (e) { // @link:catch
    console.warn('Profile failed', e); // @link:log
  }
}
