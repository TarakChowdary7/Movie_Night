
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
};

type VideoState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};

type Participant = {
  id: string;
  name: string;
  isHost: boolean;
};

type RoomContextType = {
  roomId: string | null;
  username: string;
  setUsername: (name: string) => void;
  isHost: boolean;
  participants: Participant[];
  messages: Message[];
  videoState: VideoState;
  video: File | null;
  videoUrl: string | null;
  setVideo: (file: File | null) => void;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (text: string) => void;
  setVideoState: (state: Partial<VideoState>) => void;
  updateVideoTime: (time: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  isRoomActive: boolean;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

function generateRoomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isHost, setIsHost] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });
  const [isRoomActive, setIsRoomActive] = useState(false);

  // Mock WebRTC connections for demo purposes
  // In a real application, this would be replaced with actual WebRTC implementation

  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [video]);

  // Check URL for room ID on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomIdFromUrl = params.get('roomId');
    if (roomIdFromUrl) {
      // Store room ID but don't join yet (need username first)
      setRoomId(roomIdFromUrl);
    }
  }, []);

  const createRoom = () => {
    if (!username) {
      toast.error("Please enter your name before creating a room");
      return;
    }
    
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsHost(true);
    setIsRoomActive(true);
    
    // Add yourself as a participant
    setParticipants([
      { id: 'self', name: username, isHost: true }
    ]);
    
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('roomId', newRoomId);
    window.history.pushState({}, '', url.toString());
    
    toast.success(`Room created! Share code: ${newRoomId}`);
  };

  const joinRoom = (id: string) => {
    if (!username) {
      toast.error("Please enter your name before joining a room");
      return;
    }
    
    setRoomId(id);
    setIsHost(false);
    setIsRoomActive(true);
    
    // Simulate joining a room with a host already present
    setParticipants([
      { id: 'host', name: 'Room Host', isHost: true },
      { id: 'self', name: username, isHost: false }
    ]);
    
    // Update URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.set('roomId', id);
    window.history.pushState({}, '', url.toString());
    
    toast.success(`Joined room ${id}`);
  };

  const leaveRoom = () => {
    setRoomId(null);
    setIsHost(false);
    setParticipants([]);
    setMessages([]);
    setVideo(null);
    setVideoUrl(null);
    setVideoState({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
    setIsRoomActive(false);
    
    // Clear the URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('roomId');
    window.history.pushState({}, '', url.toString());
  };

  const sendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      sender: username,
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const updateVideoState = (state: Partial<VideoState>) => {
    setVideoState((prev) => ({ ...prev, ...state }));
  };

  const updateVideoTime = (time: number) => {
    setVideoState((prev) => ({ ...prev, currentTime: time }));
  };

  const playVideo = () => {
    setVideoState((prev) => ({ ...prev, isPlaying: true }));
  };

  const pauseVideo = () => {
    setVideoState((prev) => ({ ...prev, isPlaying: false }));
  };

  const value = {
    roomId,
    username,
    setUsername,
    isHost,
    participants,
    messages,
    videoState,
    video,
    videoUrl,
    setVideo,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    setVideoState: updateVideoState,
    updateVideoTime,
    playVideo,
    pauseVideo,
    isRoomActive,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
