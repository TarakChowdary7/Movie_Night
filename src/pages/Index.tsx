
import { useRoom } from '@/context/RoomContext';
import Welcome from '@/components/Welcome';
import Room from '@/components/Room';

const Index = () => {
  const { isRoomActive } = useRoom();

  return isRoomActive ? <Room /> : <Welcome />;
};

export default Index;
