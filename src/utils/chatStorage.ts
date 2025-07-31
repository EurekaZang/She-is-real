// src/utils/chatStorage.ts
import { ChatMessage } from '@/app/types';

const STORAGE_KEY = 'persona_chat_messages';

export function getMessagesMap(): Record<string, ChatMessage[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setMessagesMap(map: Record<string, ChatMessage[]>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getMessages(personaId: string): ChatMessage[] {
  const map = getMessagesMap();
  return map[personaId] || [];
}

export function appendMessage(personaId: string, message: ChatMessage) {
  const map = getMessagesMap();
  map[personaId] = [...(map[personaId] || []), message];
  setMessagesMap(map);
}