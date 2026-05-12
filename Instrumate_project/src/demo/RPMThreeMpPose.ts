// src/demo/RPMThreeMpPose.ts
// Re-typing the JS file for TypeScript compatibility

import { Skeleton, PerspectiveCamera, OrthographicCamera, Vector3 } from 'three';

// We import the actual JS logic
// @ts-ignore
import { ThreeMpPose as ThreeMpPoseJS } from './RPMThreeMpPose.js';

export interface IThreeMpPose {
    pose3dDict: Record<string, Vector3>;
    newJoints3D: Record<string, Vector3>;
    poseLandmarks: Record<string, any>;
    freezeHips: boolean;
    freezeLegs: boolean;
    updateMpLandmarks(mediapipeJoints: any[]): void;
    add3dJointsForMixamo(): void;
    transformToWorld(camera: PerspectiveCamera | OrthographicCamera, dist_from_cam: number, offset: Vector3): void;
    rigSolverForMixamo(skeleton: Skeleton): void;
}

// Export the JS class with the Type interface
export const ThreeMpPose = ThreeMpPoseJS as {
    new (): IThreeMpPose;
};