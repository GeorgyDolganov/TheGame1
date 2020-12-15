import { Mesh, MeshBuilder } from "@babylonjs/core";

export default class Ramy {
  mesh: Mesh;
  constructor(engine, scene, camera, materials) {
    this.mesh = MeshBuilder.CreatePlane("Ramy", { size: 30 }, scene);
    this.mesh.position.y = 7;
    this.mesh.rotation.x = Math.PI;
    this.mesh.position.z = -150;
    this.mesh.material = materials.sprites.guy;
    this.mesh.isPickable = false;
    engine.runRenderLoop(() => {
      this.mesh.lookAt(camera.position, Math.PI);
    });
  }

  public talkTo() {}
}
