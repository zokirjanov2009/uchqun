const STORAGE_KEY = 'uchqun-chat-messages';

export function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function persist(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-200)));
}

export function addMessage(author, text) {
  const msg = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    author,
    text,
    time: new Date().toISOString(),
  };
  const current = loadMessages();
  const updated = [...current, msg];
  persist(updated);
  return updated;
}

