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

export function updateMessage(id, text) {
  const current = loadMessages();
  const updated = current.map((m) => (m.id === id ? { ...m, text } : m));
  persist(updated);
  return updated;
}

export function deleteMessage(id) {
  const current = loadMessages();
  const updated = current.filter((m) => m.id !== id);
  persist(updated);
  return updated;
}

