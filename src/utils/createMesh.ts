/* eslint-disable no-param-reassign */
import {
  MeshBuilder, Mesh, PhysicsImpostor, Scene, Quaternion,
} from '@babylonjs/core';

export default (
  varToAssign,
  functionName,
  mainOptions: [string, object, Scene],
  otherOptions?: object,
  physics?: [string, {mass: number, friction?: number, restitution?: number}],
) => {
  varToAssign = MeshBuilder[functionName](
    mainOptions[0],
    mainOptions[1],
    mainOptions[2],
  );
  if (!otherOptions) return varToAssign;
  Object.keys(otherOptions).forEach((param) => {
    varToAssign[param] = otherOptions[param];
  });
  if (!physics) return varToAssign;
  varToAssign.physicsImpostor = new PhysicsImpostor(
    varToAssign,
    PhysicsImpostor[physics[0]],
    physics[1],
    mainOptions[2],
  );
  const dummy = new Mesh(
    `${mainOptions[0]}-dummy`,
    mainOptions[2],
  );
  dummy.rotationQuaternion = new Quaternion();
  return varToAssign;
};
