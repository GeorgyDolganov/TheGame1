import { Vector3 } from '@babylonjs/core';

export default function multiplyQuaternionByVector(quaternion, vector) {
  const target = new Vector3();
  const { x } = vector;
  const { y } = vector;
  const { z } = vector;

  const qx = quaternion.x;
  const qy = quaternion.y;
  const qz = quaternion.z;
  const qw = quaternion.w;

  // q*v
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return target;
}
