import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ThreeMpPose } from "../demo/RPMThreeMpPose"; // Use the .ts bridge we made

const Demo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene & Renderer Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf9f6);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 4); // Better initial view for signing

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoother feel
    
    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 10, 10);
    scene.add(dirLight);

    // --- State Variables ---
    let skeleton: THREE.Skeleton | null = null;
    let mediapipeData: any[] | null = null;
    let frameIndex = 0;
    const mpPose = new ThreeMpPose();

    // --- Loading Assets ---
    const loader = new GLTFLoader();
    
    // Ensure female.glb is in public/ folder
    loader.load(
      "/female.glb", 
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.traverse((o: any) => {
          if (o.isSkinnedMesh) {
            skeleton = o.skeleton;
          }
        });
        
        // Center view on avatar
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        controls.target.set(center.x, center.y, center.z);
      },
      undefined,
      (err) => console.error("Error loading GLB:", err)
    );

    // Ensure JSON is in public/ folder
    fetch("/BETTER_smoothed_frozen.json")
      .then((r) => r.json())
      .then((data) => {
        mediapipeData = data;
      })
      .catch(err => console.error("Error loading JSON:", err));

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (skeleton && mediapipeData) {
        const mpFrame = mediapipeData[frameIndex];
        
        mpPose.updateMpLandmarks(mpFrame);
        // Transform to world coordinates
        mpPose.transformToWorld(camera, 4.0, new THREE.Vector3(0, -1, 0));
        mpPose.add3dJointsForMixamo();
        mpPose.rigSolverForMixamo(skeleton);

        frameIndex = (frameIndex + 1) % mediapipeData.length;
      }

      controls.update(); // Required if damping is enabled
      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start py-10 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-[800] text-[#2D1A4A]">Signing Demo</h1>
        <p className="text-[#514B5C]/60 italic">Automated Motion Reconstruction</p>
      </div>
      
      {/* Three.js Container */}
      <div 
        ref={mountRef} 
        className="w-full max-w-5xl h-[650px] bg-white rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden"
      />
    </div>
  );
};

export default Demo;