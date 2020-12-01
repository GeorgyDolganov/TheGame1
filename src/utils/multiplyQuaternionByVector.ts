import { Vector3 } from "@babylonjs/core";

export default function multiplyQuaternionByVector (quaternion, vector) {
  var target = new Vector3();
  var x = vector.x,
    y = vector.y,
    z = vector.z;

  var qx = quaternion.x,
    qy = quaternion.y,
    qz = quaternion.z,
    qw = quaternion.w;

  // q*v
  var ix = qw * x + qy * z - qz * y,
    iy = qw * y + qz * x - qx * z,
    iz = qw * z + qx * y - qy * x,
    iw = -qx * x - qy * y - qz * z;

  target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return target;
}
