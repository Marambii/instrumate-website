import { useGLTF, useAnimations } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Group } from 'three';

export default function AvatarModel() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF('/female.glb');
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions['SignHello']?.reset().play(); // replace with actual animation name
    }
  }, [actions]);

  return <primitive object={scene} ref={group} />;
}
