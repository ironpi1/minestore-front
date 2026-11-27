const AUTH_STORAGE_KEY = 'mine_auth';

export function getStoredAuth() {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!storedAuth) return null;

  try {
    const session = JSON.parse(storedAuth);
    if (session && typeof session.token === 'string' && session.token) {
      return session;
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  return null;
}

export function saveAuth(session) {
  if (!session || typeof session.token !== 'string' || !session.token) {
    throw new Error('La sesión debe incluir un token válido.');
  }

  const savedSession = {
    token: session.token,
    role: session.role ?? null,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(savedSession));
  return savedSession;
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}