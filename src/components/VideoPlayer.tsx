
import { useRef, useEffect, useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Upload, Volume2, VolumeX, Film } from 'lucide-react';
import { toast } from 'sonner';

const VideoPlayer = () => {
  const { 
    isHost, 
    videoUrl, 
    videoState, 
    setVideoState, 
    updateVideoTime,
    playVideo,
    pauseVideo,
    setVideo
  } = useRoom();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Handle video upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a video file');
        return;
      }
      
      setVideo(file);
      toast.success(`Video "${file.name}" uploaded successfully`);
    }
  };

  // Sync video element with state
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Update play/pause state
      if (videoState.isPlaying && video.paused) {
        video.play().catch(err => console.error('Error playing video:', err));
      } else if (!videoState.isPlaying && !video.paused) {
        video.pause();
      }
      
      // Update time if it's off by more than 1 second
      if (Math.abs(video.currentTime - videoState.currentTime) > 1) {
        video.currentTime = videoState.currentTime;
      }
    }
  }, [videoState]);

  // Handle local video events
  const handleTimeUpdate = () => {
    if (videoRef.current && isHost) {
      updateVideoTime(videoRef.current.currentTime);
    }
  };

  const handlePlay = () => {
    if (isHost) {
      playVideo();
    }
  };

  const handlePause = () => {
    if (isHost) {
      pauseVideo();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && isHost) {
      setVideoState({
        duration: videoRef.current.duration,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSeek = (values: number[]) => {
    if (videoRef.current && isHost) {
      const newTime = values[0];
      videoRef.current.currentTime = newTime;
      updateVideoTime(newTime);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card className="border-muted/30">
      <CardContent className="p-0 relative">
        <div className="video-container relative aspect-video bg-muted/50 flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full"
              />
              
              {/* Video controls */}
              <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col gap-2">
                <Slider
                  value={[videoState.currentTime]}
                  min={0}
                  max={videoState.duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  disabled={!isHost}
                  className="cursor-pointer"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {videoState.isPlaying ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => isHost && pauseVideo()}
                        disabled={!isHost}
                        className="text-white hover:bg-white/20 h-8 w-8"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => isHost && playVideo()}
                        disabled={!isHost}
                        className="text-white hover:bg-white/20 h-8 w-8"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 h-8 w-8"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <span className="text-xs text-white">
                      {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
                    </span>
                  </div>
                  
                  {!isHost && (
                    <span className="text-xs text-white/80">
                      Only the host can control playback
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              {isHost ? (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Upload a video to begin watching</p>
                  <label htmlFor="video-upload">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      asChild
                    >
                      <span>Select Video File</span>
                    </Button>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="animate-pulse mb-4">
                    <Film className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Waiting for the host to share a video...
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
