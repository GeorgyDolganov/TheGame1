import { Mesh, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";
import handTexture from "../../assets/textures/selfmade/hand.png";
export default class Hand {
  public mesh: Mesh;
  private material: StandardMaterial;
  private texture: Texture;

  constructor(scene, camera) {
      this._createTexture(scene);
      this._createMaterial(scene);
      this._createMesh(scene,camera);
  }

  private _createTexture(scene) {
      this.texture = new Texture(handTexture, scene, false, true, Texture.NEAREST_SAMPLINGMODE);
  }

  private _createMaterial(scene) {
    this.material = new StandardMaterial("hand", scene);
    this.material.diffuseTexture = this.texture;
    this.material.diffuseTexture.hasAlpha = true;
  }

  private _createMesh(scene, camera) {
    this.mesh = MeshBuilder.CreatePlane("hand", { size: 30 }, scene);
    this.mesh.position.set(1.9, -1, 3);
    this.mesh.scaling.set(0.05, 0.05, 0.05);
    this.mesh.material = this.material;
    this.mesh.isPickable = false;
    this.mesh.parent = camera;
  }
}
