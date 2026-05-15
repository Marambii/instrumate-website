import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";

// 1. Define the shape of your props
interface SignAvatarProps {
  animationData: any; // Ideally, replace 'any' with your specific data structure once known
}

// 2. Apply the interface to the component
export default function SignAvatar({ animationData }: SignAvatarProps) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enablePan={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        {/* Use the prop to drive logic */}
        <meshStandardMaterial color={animationData ? "#359dff" : "gray"} />
      </mesh>

      <Environment preset="city" />
    </Canvas>
  );
}