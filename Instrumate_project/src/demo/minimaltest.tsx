/**
 * KSL Avatar - Minimal Reproduction Test
 * 
 * Use this to isolate the bug:
 * - Does the problem occur in transformToWorld()?
 * - Or in rigSolverForMixamo()?
 * 
 * This test animates the avatar WITHOUT MediaPipe data,
 * so you can verify the skeleton itself works.
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const MinimalTest: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ========== SETUP ==========
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();

    // Lighting
    const light = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(light);

    // ========== LOAD MODEL ==========
    let skeleton: THREE.Skeleton | null = null;

    const loader = new GLTFLoader();
    loader.load("/female.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);

      model.traverse((node: any) => {
        if (node.isSkinnedMesh) {
          skeleton = node.skeleton;
          if (node.material) {
            node.material.transparent = false;
            node.material.opacity = 1.0;
          }
        }
      });

      scene.add(model);
      console.log("✓ Model loaded with", skeleton?.bones.length, "bones");
    });

    // ========== ANIMATION ==========
    let time = 0;
    let frameCount = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016; // 60 FPS

      if (skeleton && skeleton.bones.length > 0) {
        // TEST 1: Simple hand-coded bone animation (no MediaPipe)
        // If THIS works, the skeleton is fine
        // If THIS doesn't work, something else is wrong
        
        const hips = skeleton.bones.find(b => b.name === "Hips");
        const leftArm = skeleton.bones.find(b => b.name === "LeftArm");
        const rightArm = skeleton.bones.find(b => b.name === "RightArm");

        if (hips) {
          // Gentle up-down bob
          hips.position.y = 1.0 + Math.sin(time * 2) * 0.1;
        }

        if (leftArm) {
          // Arm wave
          const quat = new THREE.Quaternion();
          quat.setFromEuler(
            new THREE.Euler(
              Math.sin(time * 2) * 0.5,  // Pitch
              0,
              Math.cos(time * 2) * 0.3   // Roll
            )
          );
          leftArm.quaternion.slerp(quat, 0.1);
        }

        if (rightArm) {
          const quat = new THREE.Quaternion();
          quat.setFromEuler(
            new THREE.Euler(
              Math.sin(time * 2 + Math.PI) * 0.5,
              0,
              Math.cos(time * 2 + Math.PI) * 0.3
            )
          );
          rightArm.quaternion.slerp(quat, 0.1);
        }

        frameCount++;

        // Print stats every 60 frames
        if (frameCount % 60 === 0) {
          const hipsPos = hips?.position || new THREE.Vector3();
          console.log(`Frame ${frameCount}: Hips Y = ${hipsPos.y.toFixed(2)}`);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Minimal Test</h1>
        <p className="text-gray-300 text-sm">
          Avatar should animate with simple hand-coded bone movements.
          <br />
          <strong>If visible:</strong> Skeleton is OK, problem is in MediaPipe rigging<br />
          <strong>If invisible:</strong> Problem is elsewhere (model, scale, material)
        </p>
      </div>

      <div
        ref={mountRef}
        className="w-full max-w-3xl h-[500px] bg-black rounded-lg border-4 border-gray-700"
      />

      <div className="mt-4 text-center text-xs text-gray-500 max-w-2xl">
        Open browser console (F12) and watch for the "Frame X: Hips Y = ..." messages.
        <br />
        If you see the avatar animating up-and-down, the skeleton works!
      </div>
    </div>
  );
};

export default MinimalTest;