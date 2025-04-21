
import React, { useState, useRef, useEffect } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
  const { messages, sendMessage, username } = useRoom();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-full border-muted/30">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-movienight-primary" />
          <h3 className="font-medium">Chat</h3>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        {messages.length > 0 ? (
          <div className="h-full overflow-y-auto p-4 chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`mb-3 ${message.sender === username ? 'chat-message-self' : ''}`}>
                <div className={`
                  rounded-lg p-2 inline-block max-w-[85%]
                  ${message.sender === username 
                    ? 'bg-movienight-primary text-white ml-auto' 
                    : 'bg-muted text-muted-foreground'}
                `}>
                  <p className="text-xs font-medium mb-1">{message.sender}</p>
                  <p className="break-words">{message.text}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground p-4 text-center">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2">
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit" 
            size="icon"
            disabled={!newMessage.trim()}
            className="bg-movienight-primary hover:bg-movienight-secondary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;
