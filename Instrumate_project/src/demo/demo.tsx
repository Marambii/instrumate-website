import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ThreeMpPose } from "../demo/RPMThreeMpPose"; // Use the .ts bridge we made

const Demo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!mountRef.current) return;
    // Add this temporarily at the top of your useEffect
    

    // --- Scene & Renderer Setup ---
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xfaf9f6);
    scene.background = new THREE.Color(0x111111); // Near black

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 3); // 3 meters away is perfect for a full-body view


    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smoother 
    controls.target.set(0, 1, 0);   // Look at the "chest" height
    controls.update();
    
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

    // Add high-intensity lights to verify visibility
// Replace your current lights with these high-intensity ones
  const ambientLight = new THREE.AmbientLight(0xffffff, 3.0); // Crank this up
  scene.add(ambientLight);

  const frontLight = new THREE.DirectionalLight(0xffffff, 2.0);
  frontLight.position.set(0, 2, 4);
  scene.add(frontLight);

    // Force the camera to a position that usually captures standard GLB models
    camera.position.set(0, 1.6, 5); 
    controls.target.set(0, 1, 0); // Point at the "chest" area
    controls.update();

    const testCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    testCube.position.set(0, 1, 0);
    scene.add(testCube);
    
    loader.load("/female.glb", (gltf) => {
      const model = gltf.scene;
      
      // 1. Force Scale: Ensure it's not microscopic
      model.scale.set(1, 1, 1); 
      
      // 2. Force Position: Put it exactly where the red square is
      model.position.set(0, 0, 0); 

      model.traverse((o: any) => {
        if (o.isSkinnedMesh) {
          skeleton = o.skeleton;
          o.frustumCulled = false;
          // 3. Force Material Visibility: Remove transparency issues
          if (o.material) {
            o.material.transparent = false;
            o.material.opacity = 1.0;
          }
        }
      });

      scene.add(model);
      console.log("Avatar added to scene at origin.");
    });

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

      // Only run logic if assets are present AND the skeleton has bones
      if (skeleton && skeleton.bones.length > 0 && mediapipeData) {
       
        if (skeleton && mediapipeData) {
          const mpFrame = mediapipeData[frameIndex];
          if (mpFrame) {
            try {
              mpPose.updateMpLandmarks(mpFrame);
              // Ensure transformToWorld isn't outputting extreme values
              // Use a 0,0,0 offset and a smaller distance to keep it at the origin
              mpPose.transformToWorld(camera, 1.0, new THREE.Vector3(0, 0, 0));
              mpPose.add3dJointsForMixamo();
              mpPose.rigSolverForMixamo(skeleton);
            } catch (e) {
              console.error("Rigging math error:", e);
            }
          }
        }

        frameIndex = (frameIndex + 1) % mediapipeData.length;
      }

      controls.update();
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