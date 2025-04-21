import { useState, useEffect, useRef } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const VideoChat = () => {
  const { participants } = useRoom();
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Simulate turning on camera when video is enabled
  useEffect(() => {
    let stream: MediaStream | null = null;

    const setupCamera = async () => {
      try {
        if (isVideoEnabled) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicEnabled });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setIsVideoEnabled(false);
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoEnabled, isMicEnabled]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="flex flex-col h-full border-muted/30">
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-movienight-primary" />
          <h3 className="font-medium">Video Chat</h3>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-2 flex flex-col">
        <div className="grid grid-cols-2 gap-2 flex-1">
          {/* Self video */}
          <div className="relative bg-muted/50 rounded-lg overflow-hidden">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="h-16 w-16 bg-movienight-primary">
                  <AvatarFallback>{getInitials('You')}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded text-white">
              You {!isVideoEnabled && "(camera off)"}
            </div>
          </div>
          
          {/* Other participants */}
          {participants
            .filter(p => p.id !== 'self')
            .map(participant => (
              <div key={participant.id} className="relative bg-muted/50 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-16 w-16 bg-movienight-secondary">
                    <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded text-white">
                  {participant.name} {participant.isHost && "(Host)"}
                </div>
              </div>
            ))}
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          <Button
            size="icon"
            variant={isMicEnabled ? "default" : "outline"}
            onClick={toggleMic}
            className={isMicEnabled ? "bg-movienight-primary hover:bg-movienight-secondary" : ""}
          >
            {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant={isVideoEnabled ? "default" : "outline"}
            onClick={toggleVideo}
            className={isVideoEnabled ? "bg-movienight-primary hover:bg-movienight-secondary" : ""}
          >
            {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoChat;
