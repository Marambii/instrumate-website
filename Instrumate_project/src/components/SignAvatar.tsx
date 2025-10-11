import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AvatarModel from './AvatarModel';
    
export default function SignAvatar() {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[2, 2, 5]} />
        <AvatarModel />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
