import {
  Mesh, MeshBuilder, StandardMaterial, Texture, Color3,
} from '@babylonjs/core';
import handTexture from '../materials/assets/textures/selfmade/hand.png';

export default class Hand {
  public mesh: Mesh;

  private material: StandardMaterial;

  private texture: Texture;

  constructor(scene, camera) {
    this.createTexture(scene);
    this.createMaterial(scene);
    this.createMesh(scene, camera);
  }

  private createTexture(scene) {
    this.texture = new Texture(handTexture, scene, false, true, Texture.NEAREST_SAMPLINGMODE);
  }

  private createMaterial(scene) {
    this.material = new StandardMaterial('hand', scene);
    this.material.diffuseTexture = this.texture;
    this.material.diffuseTexture.hasAlpha = true;
    this.material.emissiveColor = new Color3(1, 1, 1);
    this.material.disableLighting = true;
  }

  private createMesh(scene, camera) {
    this.mesh = MeshBuilder.CreatePlane('hand', { size: 30 }, scene);
    this.mesh.position.set(1.9, -1, 3);
    this.mesh.scaling.set(0.05, 0.05, 0.05);
    this.mesh.material = this.material;
    this.mesh.isPickable = false;
    this.mesh.parent = camera;
    this.mesh.renderingGroupId = 2;
  }
}
