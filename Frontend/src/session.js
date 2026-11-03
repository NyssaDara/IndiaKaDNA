// Temporary browser-only session. Replace with real backend authentication when it is ready.
const KEY = 'ikd_session'

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null
  } catch {
    return null
  }
}

export function saveSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

export const homeFor = session => (session && session.role === 'contributor' ? '/contribute' : '/dashboard')
