import { Mesh, MeshBuilder } from '@babylonjs/core';

export interface MinionOptions {
  name: string,
  size: number,
  material: any,
  position: {
    y: number,
    x: number,
    z: number
  }
}

export default class Minion {
  private defaultOptions: MinionOptions = {
    name: 'minion_Default',
    size: 30,
    material: undefined,
    position: {
      y: 30,
      x: 0,
      z: -150,
    },
  };

  mesh: Mesh;

  image: any;

  constructor(scene, options_?) {
    const options = { ...this.defaultOptions, ...options_ };
    this.mesh = MeshBuilder.CreatePlane(options.name, { size: options.size }, scene);
    this.mesh.position.set(options.position.x, options.position.y, options.position.z);
    this.mesh.material = options.material;
    this.mesh.isPickable = true;
    this.mesh.billboardMode = Mesh.BILLBOARDMODE_Y;

    // this.follow();
  }

  // follow() {
  // }
}
