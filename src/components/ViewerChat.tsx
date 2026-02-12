import { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  uid: string;
  email: string;
  text: string;
  timestamp: Date;
}

const ViewerChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(
      collection(db, 'chat_messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          uid: data.uid,
          email: data.email,
          text: data.text,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });
      setMessages(msgs);

      // Auto-scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return unsubscribe;
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'chat_messages'), {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || 'Anonymous',
        text: newMessage,
        timestamp: Timestamp.now(),
      });
      setNewMessage('');
    } catch (error: any) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <div className="border-b border-border p-4">
        <h3 className="font-bold text-lg">Viewer Chat</h3>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <p className="font-medium text-primary text-xs mb-1">
                {msg.email}
              </p>
              <p className="text-foreground bg-secondary/50 p-2 rounded">
                {msg.text}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !newMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};

export default ViewerChat;
