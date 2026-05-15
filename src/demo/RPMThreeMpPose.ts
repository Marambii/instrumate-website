import {
  Quaternion,
  Vector3,
  Matrix4,
  PerspectiveCamera,
  OrthographicCamera,
  Skeleton,
} from 'three';

export interface MpLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export class ThreeMpPose {
  name_to_index: Record<string, number>;
  index_to_name: Record<number, string>;
  poseLandmarks: Record<string, MpLandmark> = {};
  pose3dDict: Record<string, Vector3> = {};
  newJoints3D: Record<string, Vector3> = {};
  freezeHips: boolean;
  freezeLegs: boolean;
  srcJoints: MpLandmark[] = [];

  constructor() {
    this.name_to_index = {
      nose: 0,
      left_eye_inner: 1,
      left_eye: 2,
      left_eye_outer: 3,
      right_eye_inner: 4,
      right_eye: 5,
      right_eye_outer: 6,
      left_ear: 7,
      right_ear: 8,
      mouse_left: 9,
      mouse_right: 10,
      left_shoulder: 11,
      right_shoulder: 12,
      left_elbow: 13,
      right_elbow: 14,
      left_wrist: 15,
      right_wrist: 16,
      left_pinky: 17,
      right_pinky: 18,
      left_index: 19,
      right_index: 20,
      left_thumb: 21,
      right_thumb: 22,
      left_hip: 23,
      right_hip: 24,
      left_knee: 25,
      right_knee: 26,
      left_ankle: 27,
      right_ankle: 28,
      left_heel: 29,
      right_heel: 30,
      left_foot_index: 31,
      right_foot_index: 32,
    };
    this.index_to_name = {};
    for (const [key, value] of Object.entries(this.name_to_index)) {
      this.index_to_name[value] = key;
    }
    this.freezeHips = true;
    this.freezeLegs = true;
  }

  numSrcLandmarks(): number {
    return Object.keys(this.index_to_name).length;
  }

  updateMpLandmarks(mediapipeJoints: MpLandmark[]): void {
    this.srcJoints = mediapipeJoints;
    const pose_landmarks_dict: Record<string, MpLandmark> = {};
    mediapipeJoints.forEach((landmark, i) => {
      const name = this.index_to_name[i];
      if (name) pose_landmarks_dict[name] = landmark;
    });
    this.poseLandmarks = pose_landmarks_dict;
  }

  transformToWorld(
    camera: PerspectiveCamera | OrthographicCamera,
    dist_from_cam: number,
    offset: Vector3
  ): void {
    const ip_lt = new Vector3(-1, 1, -1).unproject(camera);
    const ip_rb = new Vector3(1, -1, -1).unproject(camera);
    const ip_diff = new Vector3().subVectors(ip_rb, ip_lt);
    const x_scale = Math.abs(ip_diff.x);

    function ProjScale(
      p_ms: Vector3,
      cam_pos: Vector3,
      src_d: number,
      dst_d: number
    ): Vector3 {
      const vec_cam2p = new Vector3().subVectors(p_ms, cam_pos);
      return new Vector3().addVectors(
        cam_pos,
        vec_cam2p.multiplyScalar(dst_d / src_d)
      );
    }

    this.pose3dDict = {};
    for (const [key, value] of Object.entries(this.poseLandmarks)) {
      let p_3d = new Vector3(
        (value.x - 0.5) * 2.0,
        -(value.y - 0.5) * 2.0,
        0
      ).unproject(camera);
      p_3d.z = -value.z * x_scale;

      if ((camera as PerspectiveCamera).isPerspectiveCamera) {
        p_3d = ProjScale(
          p_3d,
          camera.position,
          (camera as PerspectiveCamera).near,
          dist_from_cam
        );
      } else {
        p_3d.z += dist_from_cam;
      }

      this.pose3dDict[key] = p_3d.add(offset);
    }
  }

  add3dJointsForMixamo(): void {
    const center_hips = new Vector3()
      .addVectors(this.pose3dDict['left_hip'], this.pose3dDict['right_hip'])
      .multiplyScalar(0.5);
    const mp_left_shoulder = this.pose3dDict['left_shoulder'];
    const mp_right_shoulder = this.pose3dDict['right_shoulder'];
    const center_shoulders = new Vector3()
      .addVectors(mp_left_shoulder, mp_right_shoulder)
      .multiplyScalar(0.5);
    const center_ear = new Vector3()
      .addVectors(this.pose3dDict['left_ear'], this.pose3dDict['right_ear'])
      .multiplyScalar(0.5);

    const dir_spine = new Vector3()
      .subVectors(center_shoulders, center_hips)
      .normalize();
    const dir_shoulders = new Vector3().subVectors(
      mp_right_shoulder,
      mp_left_shoulder
    );
    const length_spine = new Vector3()
      .subVectors(center_shoulders, center_hips)
      .length();

    this.newJoints3D['hips'] = new Vector3().addVectors(
      center_hips,
      dir_spine.clone().multiplyScalar(length_spine / 9.0)
    );
    this.newJoints3D['spine0'] = new Vector3().addVectors(
      center_hips,
      dir_spine.clone().multiplyScalar((length_spine / 9.0) * 3)
    );
    this.newJoints3D['spine1'] = new Vector3().addVectors(
      center_hips,
      dir_spine.clone().multiplyScalar((length_spine / 9.0) * 5)
    );
    this.newJoints3D['spine2'] = new Vector3().addVectors(
      center_hips,
      dir_spine.clone().multiplyScalar((length_spine / 9.0) * 7)
    );

    const neck = new Vector3().addVectors(
      center_shoulders,
      dir_spine.clone().multiplyScalar(length_spine / 9.0)
    );
    this.newJoints3D['neck'] = neck;
    this.newJoints3D['shoulder_left'] = new Vector3().addVectors(
      mp_left_shoulder,
      dir_shoulders.clone().multiplyScalar(1 / 3.0)
    );
    this.newJoints3D['shoulder_right'] = new Vector3().addVectors(
      mp_left_shoulder,
      dir_shoulders.clone().multiplyScalar(2 / 3.0)
    );

    const dir_head = new Vector3().subVectors(center_ear, neck);
    this.newJoints3D['head'] = new Vector3().addVectors(
      neck,
      dir_head.clone().multiplyScalar(0.5)
    );

    for (const [key, value] of Object.entries(this.newJoints3D)) {
      this.pose3dDict[key] = value;
    }
  }

  rigSolverForMixamo(skeleton: Skeleton): void {
    const computeR_hips = (): Matrix4 => {
      const hip_joint = this.pose3dDict['hips'];
      let u = new Vector3()
        .subVectors(this.pose3dDict['left_hip'], this.pose3dDict['right_hip'])
        .normalize();
      const v = new Vector3()
        .subVectors(this.pose3dDict['neck'], hip_joint)
        .normalize();
      const w = new Vector3().crossVectors(u, v).normalize();
      u = new Vector3().crossVectors(v, w).normalize();
      return new Matrix4().makeBasis(u, v, w);
    };

    const R_hips = computeR_hips();
    const hip_root = skeleton.getBoneByName('Hips');

    if (!hip_root) {
      console.warn('Hips bone not found in skeleton');
      return;
    }

    hip_root.position.set(0, 0, 0);
    if (this.freezeHips) {
      hip_root.quaternion.copy(new Quaternion());
    } else {
      hip_root.quaternion.slerp(
        new Quaternion().setFromRotationMatrix(R_hips),
        0.9
      );
    }

    const R_chain_root = R_hips.clone();

    const computeJointParentR = (
      nameSkeletonJoint: string,
      nameMpJoint: string,
      nameMpJointParent: string,
      R_chain: Matrix4
    ): Matrix4 => {
      const skeletonJoint = skeleton.getBoneByName(nameSkeletonJoint);
      if (!skeletonJoint) {
        console.warn(`Bone not found: ${nameSkeletonJoint}`);
        return new Matrix4();
      }
      const j = skeletonJoint.position.clone().normalize();
      const mpJoint = this.pose3dDict[nameMpJoint];
      const mpJointParent = this.pose3dDict[nameMpJointParent];
      if (!mpJoint || !mpJointParent) {
        console.warn(`MP joint missing: ${nameMpJoint} or ${nameMpJointParent}`);
        return new Matrix4();
      }
      const v = new Vector3()
        .subVectors(mpJoint, mpJointParent)
        .normalize()
        .applyMatrix4(R_chain.clone().transpose());
      return this.computeR(j, v);
    };

    const slerp = (boneName: string, R: Matrix4, factor = 0.9) => {
      const bone = skeleton.getBoneByName(boneName);
      if (bone) {
        bone.quaternion.slerp(new Quaternion().setFromRotationMatrix(R), factor);
      }
    };

    // Spine chain
    let R_chain_spines: Matrix4;
    {
      let R_chain = R_chain_root.clone();

      const R_spine0 = computeJointParentR('Spine1', 'spine1', 'spine0', R_chain);
      slerp('Spine', R_spine0);
      R_chain.multiply(R_spine0);

      const R_spine1 = computeJointParentR('Spine2', 'spine2', 'spine1', R_chain);
      slerp('Spine1', R_spine1);
      R_chain.multiply(R_spine1);

      const R_spine2 = computeJointParentR('Neck', 'neck', 'spine2', R_chain);
      slerp('Spine2', R_spine2);

      R_chain_spines = R_chain.multiply(R_spine2);
    }

    // Neck & head
    {
      let R_chain = R_chain_spines.clone();

      const R_neck = computeJointParentR('Head', 'head', 'neck', R_chain);
      slerp('Neck', R_neck);
      R_chain.multiply(R_neck);

      const R_headL = computeJointParentR('LeftEye', 'left_eye', 'head', R_chain);
      const R_headR = computeJointParentR('RightEye', 'right_eye', 'head', R_chain);
      const q_headL = new Quaternion().setFromRotationMatrix(R_headL);
      const q_headR = new Quaternion().setFromRotationMatrix(R_headR);
      const q_head = new Quaternion().slerpQuaternions(q_headL, q_headR, 0.5);
      const headBone = skeleton.getBoneByName('Head');
      if (headBone) headBone.quaternion.slerp(q_head, 0.9);
    }

    // Left arm chain
    {
      let R_chain = R_chain_spines.clone();

      const R_shoulder_left = computeJointParentR(
        'LeftArm', 'left_shoulder', 'shoulder_left', R_chain
      );
      slerp('LeftShoulder', R_shoulder_left);
      R_chain.multiply(R_shoulder_left);

      const R_arm = computeJointParentR(
        'LeftForeArm', 'left_elbow', 'left_shoulder', R_chain
      );
      slerp('LeftArm', R_arm);
      R_chain.multiply(R_arm);

      const R_forearm = computeJointParentR(
        'LeftHand', 'left_wrist', 'left_elbow', R_chain
      );
      slerp('LeftForeArm', R_forearm);
      R_chain.multiply(R_forearm);

      const R_hand = computeJointParentR(
        'LeftHandIndex1', 'left_index', 'left_wrist', R_chain
      );
      slerp('LeftHand', R_hand);
    }

    // Right arm chain
    {
      let R_chain = R_chain_spines.clone();

      const R_shoulder_right = computeJointParentR(
        'RightArm', 'right_shoulder', 'shoulder_right', R_chain
      );
      slerp('RightShoulder', R_shoulder_right);
      R_chain.multiply(R_shoulder_right);

      const R_arm = computeJointParentR(
        'RightForeArm', 'right_elbow', 'right_shoulder', R_chain
      );
      slerp('RightArm', R_arm);
      R_chain.multiply(R_arm);

      const R_forearm = computeJointParentR(
        'RightHand', 'right_wrist', 'right_elbow', R_chain
      );
      slerp('RightForeArm', R_forearm);
      R_chain.multiply(R_forearm);

      const R_hand = computeJointParentR(
        'RightHandIndex1', 'right_index', 'right_wrist', R_chain
      );
      slerp('RightHand', R_hand);
    }

    // Legs remain frozen (freezeLegs = true by default)
  }

  computeR(A: Vector3, B: Vector3): Matrix4 {
    const uA = A.clone().normalize();
    const uB = B.clone().normalize();
    const idot = uA.dot(uB);
    const cross_AB = new Vector3().crossVectors(uA, uB);
    const cdot = cross_AB.length();
    const u = uA.clone();
    const v = new Vector3()
      .subVectors(uB, uA.clone().multiplyScalar(idot))
      .normalize();
    const w = cross_AB.clone().normalize();
    const C = new Matrix4().makeBasis(u, v, w).transpose();
    const R_uvw = new Matrix4().set(
      idot, -cdot, 0, 0,
      cdot,  idot, 0, 0,
      0,     0,    1, 0,
      0,     0,    0, 1
    );
    return new Matrix4().multiplyMatrices(
      C.clone().transpose(),
      new Matrix4().multiplyMatrices(R_uvw, C)
    );
  }
}