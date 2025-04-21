
import { useRoom } from '@/context/RoomContext';
import { Button } from '@/components/ui/button';
import { LogOut, Copy } from 'lucide-react';
import { toast } from 'sonner';
import VideoPlayer from './VideoPlayer';
import Chat from './Chat';
import VideoChat from './VideoChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

const Room = () => {
  const { roomId, leaveRoom, username, participants } = useRoom();
  const isMobile = useIsMobile();

  const copyRoomLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('roomId', roomId || '');
    navigator.clipboard.writeText(url.toString())
      .then(() => {
        toast.success('Room link copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId || '')
      .then(() => {
        toast.success('Room code copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy code');
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Header */}
      <header className="border-b border-muted/30 p-4 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-movienight-primary">Movie Night Connect</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-muted/50 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              <span className="font-medium">Room: {roomId}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyRoomId}
                className="h-6 w-6"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={leaveRoom}
              className="gap-1 text-sm"
            >
              <LogOut className="h-3 w-3" />
              Leave
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto flex-1 p-4">
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {/* Video player takes full width on mobile */}
            <VideoPlayer />
            
            {/* Tabs for chat and video chat on mobile */}
            <Tabs defaultValue="chat" className="flex-1">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="chat">Text Chat</TabsTrigger>
                <TabsTrigger value="videochat">Video Chat</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="h-[400px]">
                <Chat />
              </TabsContent>
              <TabsContent value="videochat" className="h-[400px]">
                <VideoChat />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 h-[calc(100vh-150px)]">
            {/* Left: Video player */}
            <div className="col-span-2 flex flex-col">
              <VideoPlayer />
            </div>
            
            {/* Right: Split between chat and video chat */}
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <Chat />
              </div>
              <div className="flex-1">
                <VideoChat />
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-muted/30 py-3 px-4">
        <div className="container mx-auto text-xs text-muted-foreground text-center">
          <p>Connected as {username} with {participants.length} participants</p>
        </div>
      </footer>
    </div>
  );
};

export default Room;
