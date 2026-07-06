import { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';

const ROLE_LABELS = {
  client: 'Cliente',
  business: 'Tienda',
  rider: 'Mensajero',
  support: 'Soporte',
  system: 'Urabapp',
};

export default function ChatThread({
  messages = [],
  currentUserId,
  onSend,
  sending = false,
  placeholder = 'Escribe un mensaje…',
  emptyText = 'Aún no hay mensajes. Escribe aquí — todo queda dentro de Urabapp.',
  showRole = false,
}) {
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-background">
      <div className="max-h-72 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">{emptyText}</p>
        ) : (
          messages.map((msg) => {
            const mine = msg.sender_id === currentUserId;
            const staff = msg.is_staff || msg.sender_role === 'support';
            return (
              <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? 'bg-primary text-white'
                      : staff
                        ? 'bg-secondary/10 text-foreground'
                        : 'bg-muted/40 text-foreground'
                  }`}
                >
                  {showRole && !mine && (
                    <p className="mb-0.5 text-[10px] font-bold uppercase opacity-70">
                      {msg.users?.full_name || ROLE_LABELS[msg.sender_role] || 'Usuario'}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{msg.body}</p>
                  <p className={`mt-1 text-[10px] ${mine ? 'text-white/70' : 'text-muted'}`}>
                    {new Date(msg.created_at).toLocaleString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit" size="sm" disabled={sending || !text.trim()}>
          <AppIcon name="chat" size="xs" />
        </Button>
      </form>
    </div>
  );
}
