
export interface ChatMessage {
  id: string;
  text: string;
  role: 'user' | 'model';
}
