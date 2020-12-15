import { Mesh, MeshBuilder } from "@babylonjs/core";

export default class Monster {
  mesh: Mesh;
  constructor(engine, scene, camera, materials) {
    this.mesh = MeshBuilder.CreatePlane("Monster", { size: 50 }, scene);
    this.mesh.position.y = 20;
    this.mesh.rotation.x = Math.PI;
    this.mesh.position.z = -200;
    this.mesh.material = materials.sprites.monster;
    this.mesh.isPickable = false;
    engine.runRenderLoop(() => {
      this.mesh.lookAt(camera.position, Math.PI);
    });
  }

  public talkTo() {}
}
