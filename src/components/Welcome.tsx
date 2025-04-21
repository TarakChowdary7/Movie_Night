
import { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Users } from 'lucide-react';

const Welcome = () => {
  const { username, setUsername, createRoom, joinRoom } = useRoom();
  const [roomIdInput, setRoomIdInput] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/40">
      <Card className="w-[350px] shadow-lg border-muted/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-movienight-primary/20 p-4 rounded-full">
              <Film className="h-10 w-10 text-movienight-primary animate-pulse-light" />
            </div>
          </div>
          <CardTitle className="text-2xl">Movie Night Connect</CardTitle>
          <CardDescription>Watch movies together with friends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1">
                Your Name
              </label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Tabs defaultValue="join">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="join">
                  <Users className="h-4 w-4 mr-2" />
                  Join Room
                </TabsTrigger>
                <TabsTrigger value="create">
                  <Film className="h-4 w-4 mr-2" />
                  Create Room
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="join" className="space-y-4">
                <div>
                  <label htmlFor="roomId" className="text-sm font-medium block mb-1 mt-4">
                    Room Code
                  </label>
                  <Input
                    id="roomId"
                    placeholder="Enter 6-digit code"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    maxLength={6}
                    className="w-full"
                  />
                </div>
                <Button 
                  className="w-full bg-movienight-primary hover:bg-movienight-secondary text-white"
                  onClick={() => joinRoom(roomIdInput)}
                  disabled={!username || !roomIdInput || roomIdInput.length !== 6}
                >
                  Join Room
                </Button>
              </TabsContent>
              
              <TabsContent value="create">
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a new room and invite your friends to join
                  </p>
                  <Button 
                    className="w-full bg-movienight-primary hover:bg-movienight-secondary text-white"
                    onClick={createRoom}
                    disabled={!username}
                  >
                    Create New Room
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-center text-muted-foreground flex justify-center">
          <p>Watch movies in sync with video and text chat</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
