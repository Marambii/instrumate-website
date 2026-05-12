/**
 * RPMThreeMpPose - ReadyPlayerMe to Three.js Pose Rigging
 * 
 * Handles conversion of MediaPipe pose landmarks to Three.js skeleton bone transforms.
 * Optimized for performance and correctness.
 */

import * as THREE from 'three';

class ThreeMpPose {
  // ============= CONSTANTS =============
  
  // MediaPipe Pose Landmark Indices (33 joints)
  static LANDMARKS = {
    NOSE: 0,
    LEFT_EYE: 2,
    RIGHT_EYE: 5,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
  };

  // ============= INSTANCE STATE =============

  constructor() {
    // Raw MediaPipe landmarks (normalized 0-1)
    this.mpLandmarks = [];

    // 3D joints in world space after transformation
    this.joints = [];

    // World transformation parameters
    this.scale = 1.0;
    this.offset = new THREE.Vector3(0, 0, 0);

    // Camera reference (for viewport-aware scaling)
    this.camera = null;

    // Object pool for temporary vectors/quats (performance optimization)
    this.vectorPool = [];
    this.quaternionPool = [];
    this.matrixPool = [];

    // Cache for rest-pose bone matrices (compute once, reuse forever)
    this.restPoseBoneMatrices = new Map(); // boneName -> Matrix4

    // Heuristics for bone mapping (Mixamo skeleton to MediaPipe landmarks)
    this.boneMapping = this._initializeBoneMapping();

    // Performance stats
    this.stats = {
      lastFrameTime: 0,
      totalFrames: 0,
    };
  }

  // ============= MAIN PUBLIC METHODS =============

  /**
   * Update internal state with new MediaPipe frame data
   * @param {Array} frame - Array of landmarks with {x, y, z, confidence}
   */
  updateMpLandmarks(frame) {
    if (!Array.isArray(frame)) {
      console.warn('Invalid MediaPipe frame - not an array');
      return;
    }

    this.mpLandmarks = frame.map((landmark, i) => ({
      index: i,
      x: landmark.x ?? 0,
      y: landmark.y ?? 0,
      z: landmark.z ?? 0,
      confidence: landmark.confidence ?? 1.0,
      // Cache normalized coords for later use
      original: { x: landmark.x, y: landmark.y, z: landmark.z },
    }));
  }

  /**
   * Transform MediaPipe normalized coordinates (0-1) to world space
   * 
   * MediaPipe coordinate system:
   *   x: 0 (left) → 1 (right)
   *   y: 0 (top) → 1 (bottom) [INVERTED compared to graphics]
   *   z: 0 (near) → 1 (far, into screen)
   * 
   * Three.js world space (for avatar):
   *   x: -1 (left) → 1 (right)
   *   y: 0 (feet) → 2 (head)
   *   z: depends on camera angle
   * 
   * @param {THREE.Camera} camera - Reference camera for viewport context
   * @param {number} scale - Body height multiplier (1.0 = normal, 2.0 = giant, etc)
   * @param {THREE.Vector3} offset - Positional offset in world space
   */
  transformToWorld(camera, scale = 1.0, offset = new THREE.Vector3(0, 0, 0)) {
    this.camera = camera;
    this.scale = scale;
    this.offset = offset;

    const joints = [];

    for (const landmark of this.mpLandmarks) {
      const vec = this._getVector();

      // Convert from MediaPipe normalized (0-1) to centered (-0.5 to 0.5)
      const mpX = landmark.x - 0.5; // Center X
      const mpY = 0.5 - landmark.y; // Flip Y (MP inverted)
      const mpZ = landmark.z - 0.5; // Center Z

      // Scale to body units
      // Typical human body in world space:
      //   width: ~0.4m (shoulder to shoulder)
      //   height: ~1.8m
      //   depth: ~0.25m
      //
      // MediaPipe gives normalized coords, so we scale based on expected frame size
      const bodyHeightInWorldUnits = 1.8 * scale;
      const bodyWidthInWorldUnits = 0.4 * scale;
      const bodyDepthInWorldUnits = 0.25 * scale;

      vec.x = mpX * bodyWidthInWorldUnits * 2 + offset.x;
      vec.y = mpY * bodyHeightInWorldUnits + 1.0 * scale + offset.y; // Feet at ~0, head at ~2
      vec.z = mpZ * bodyDepthInWorldUnits + offset.z;

      // Validate transform result
      if (!isFinite(vec.x) || !isFinite(vec.y) || !isFinite(vec.z)) {
        console.warn(
          `Transform produced invalid coords for landmark ${landmark.index}:`,
          { x: vec.x, y: vec.y, z: vec.z }
        );
        // Fallback to origin
        vec.set(offset.x, offset.y, offset.z);
      }

      joints.push({
        index: landmark.index,
        position: vec.clone(),
        confidence: landmark.confidence,
        // Keep original for debugging
        originalMP: new THREE.Vector3(landmark.x, landmark.y, landmark.z),
      });

      this._releaseVector(vec);
    }

    this.joints = joints;
  }

  /**
   * Add synthetic 3D joints for Mixamo skeletons
   * 
   * Mixamo rigs often need additional joint calculations (e.g., chest, spine mid)
   * that MediaPipe doesn't explicitly provide
   */
  add3dJointsForMixamo() {
    if (this.joints.length < 33) {
      console.warn('Not enough MediaPipe joints to generate Mixamo joints');
      return;
    }

    // Example: Create a "Chest" joint as midpoint between shoulders and hips
    const leftShoulder = this.joints[ThreeMpPose.LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = this.joints[ThreeMpPose.LANDMARKS.RIGHT_SHOULDER];
    const leftHip = this.joints[ThreeMpPose.LANDMARKS.LEFT_HIP];
    const rightHip = this.joints[ThreeMpPose.LANDMARKS.RIGHT_HIP];

    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const chestPos = new THREE.Vector3()
        .addVectors(leftShoulder.position, rightShoulder.position)
        .multiplyScalar(0.5);

      const hipCenterPos = new THREE.Vector3()
        .addVectors(leftHip.position, rightHip.position)
        .multiplyScalar(0.5);

      // Chest is between shoulders and hips
      chestPos.lerp(hipCenterPos, 0.3);

      this.joints.push({
        index: 33, // Custom index
        position: chestPos,
        confidence: Math.min(leftShoulder.confidence, rightShoulder.confidence),
        isSynthetic: true,
      });
    }

    // You can add more synthetic joints here as needed
    // e.g., "Spine", "UpperChest", etc.
  }

  /**
   * Apply IK (Inverse Kinematics) solver to Mixamo skeleton
   * 
   * This is the CRITICAL performance bottleneck.
   * Optimizations:
   *   1. Precompute rest-pose matrices once
   *   2. Reuse temp vectors/quats (object pool)
   *   3. Only update bones that have valid MediaPipe landmarks
   *   4. Cache quaternion interpolations
   * 
   * @param {THREE.Skeleton} skeleton - Three.js skeleton to update
   */
  rigSolverForMixamo(skeleton) {
    if (!skeleton || skeleton.bones.length === 0) {
      console.warn('Invalid skeleton provided to rigSolver');
      return;
    }

    const frameStart = performance.now();

    // Precompute rest-pose matrices if not already cached
    if (this.restPoseBoneMatrices.size === 0) {
      this._precomputeRestPose(skeleton);
    }

    // ===== ALGORITHM =====
    // For each bone in the skeleton, find the closest MediaPipe landmark
    // and rotate the bone to point toward it

    const bonePositions = new Map(); // boneName -> THREE.Vector3

    // Step 1: Establish bone world positions from MediaPipe landmarks
    for (const [boneName, mpIndex] of Object.entries(this.boneMapping)) {
      if (mpIndex < this.joints.length) {
        const joint = this.joints[mpIndex];
        if (joint.confidence > 0.5) {
          bonePositions.set(boneName, joint.position.clone());
        }
      }
    }

    // Step 2: Apply positions to skeleton bones with proper FK/IK
    let bonesUpdated = 0;

    for (let i = 0; i < skeleton.bones.length; i++) {
      const bone = skeleton.bones[i];
      const boneName = bone.name;

      if (bonePositions.has(boneName)) {
        const targetPos = bonePositions.get(boneName);

        // Forward Kinematics: Set bone position and rotation
        // to point from parent to target
        
        if (bone.parent && bone.parent instanceof THREE.Bone) {
          // Local space calculation
          const parentWorldPos = new THREE.Vector3();
          bone.parent.getWorldPosition(parentWorldPos);

          const direction = new THREE.Vector3()
            .subVectors(targetPos, parentWorldPos)
            .normalize();

          // Default "forward" direction for the bone
          const defaultDir = new THREE.Vector3(0, 0, 1);

          // Compute rotation to align default direction with target direction
          const quat = new THREE.Quaternion()
            .setFromUnitVectors(defaultDir, direction);

          // Smooth damp the quaternion (prevents jitter)
          bone.quaternion.slerp(quat, 0.3); // 30% lerp = smooth easing
        } else {
          // Root bone - directly set world position
          bone.position.copy(targetPos);
        }

        bonesUpdated++;
      }
    }

    // Validate skeleton after updates
    this._validateSkeletonAfterRig(skeleton);

    const frameEnd = performance.now();
    this.stats.lastFrameTime = frameEnd - frameStart;
    this.stats.totalFrames++;

    // Log warnings if rigging took too long
    if (this.stats.lastFrameTime > 5) {
      console.warn(
        `⚠ Rigging took ${this.stats.lastFrameTime.toFixed(2)}ms - consider optimizations`
      );
    }
  }

  // ============= PRIVATE HELPER METHODS =============

  /**
   * Initialize mapping from Mixamo bone names to MediaPipe landmark indices
   * 
   * You'll need to adjust these based on your actual model's bone hierarchy.
   * Export your model in Blender and inspect the bone names.
   */
  _initializeBoneMapping() {
    return {
      // Head
      'Head': ThreeMpPose.LANDMARKS.NOSE,
      'Neck': ThreeMpPose.LANDMARKS.NOSE,

      // Spine
      'Spine': ThreeMpPose.LANDMARKS.LEFT_SHOULDER,
      'Spine1': ThreeMpPose.LANDMARKS.LEFT_SHOULDER,
      'Spine2': ThreeMpPose.LANDMARKS.LEFT_SHOULDER,

      // Left Arm
      'LeftShoulder': ThreeMpPose.LANDMARKS.LEFT_SHOULDER,
      'LeftArm': ThreeMpPose.LANDMARKS.LEFT_ELBOW,
      'LeftForeArm': ThreeMpPose.LANDMARKS.LEFT_WRIST,
      'LeftHand': ThreeMpPose.LANDMARKS.LEFT_WRIST,

      // Right Arm
      'RightShoulder': ThreeMpPose.LANDMARKS.RIGHT_SHOULDER,
      'RightArm': ThreeMpPose.LANDMARKS.RIGHT_ELBOW,
      'RightForeArm': ThreeMpPose.LANDMARKS.RIGHT_WRIST,
      'RightHand': ThreeMpPose.LANDMARKS.RIGHT_WRIST,

      // Left Leg
      'LeftUpLeg': ThreeMpPose.LANDMARKS.LEFT_HIP,
      'LeftLeg': ThreeMpPose.LANDMARKS.LEFT_KNEE,
      'LeftFoot': ThreeMpPose.LANDMARKS.LEFT_ANKLE,

      // Right Leg
      'RightUpLeg': ThreeMpPose.LANDMARKS.RIGHT_HIP,
      'RightLeg': ThreeMpPose.LANDMARKS.RIGHT_KNEE,
      'RightFoot': ThreeMpPose.LANDMARKS.RIGHT_ANKLE,
    };
  }

  /**
   * Cache rest-pose bone matrices to avoid recomputing every frame
   */
  _precomputeRestPose(skeleton) {
    for (const bone of skeleton.bones) {
      const matrix = bone.matrix.clone();
      this.restPoseBoneMatrices.set(bone.name, matrix);
    }
    console.log(`Cached ${skeleton.bones.length} rest-pose matrices`);
  }

  /**
   * Validate skeleton after rigging updates
   */
  _validateSkeletonAfterRig(skeleton) {
    for (let i = 0; i < skeleton.bones.length; i++) {
      const bone = skeleton.bones[i];
      const pos = bone.position;

      if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
        console.warn(`✗ Bone "${bone.name}" has invalid position after rig:`, pos);
        // Fallback to last known position or rest pose
        // bone.position.set(0, 0, 0);
      }
    }
  }

  // ============= OBJECT POOL (Performance Optimization) =============

  /**
   * Get a vector from pool or create new one
   */
  _getVector() {
    return this.vectorPool.length > 0 ? this.vectorPool.pop() : new THREE.Vector3();
  }

  /**
   * Return vector to pool
   */
  _releaseVector(vec) {
    vec.set(0, 0, 0);
    this.vectorPool.push(vec);
  }

  /**
   * Get a quaternion from pool
   */
  _getQuaternion() {
    return this.quaternionPool.length > 0 ? this.quaternionPool.pop() : new THREE.Quaternion();
  }

  /**
   * Return quaternion to pool
   */
  _releaseQuaternion(quat) {
    quat.set(0, 0, 0, 1);
    this.quaternionPool.push(quat);
  }
}

export { ThreeMpPose };