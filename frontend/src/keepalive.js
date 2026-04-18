const BACKEND = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

export function startKeepAlive(intervalMs = 14 * 60 * 1000) {
  const ping = () => fetch(`${BACKEND}/health`, { method: 'GET' }).catch(() => {});
  ping();
  return setInterval(ping, intervalMs);
}
