import { Mesh, MeshBuilder } from "@babylonjs/core";
import GUI from "../GUI";
import image from "../materials/assets/textures/dungeonset/char1.png";
export default class Ramy {
  mesh: Mesh;
  constructor({engine, scene, camera, materials}, options?: {size?, position?:{y?,x?,z?}}) {
    this.mesh = MeshBuilder.CreatePlane("char_Ramy", { size: options && options.size ? options.size : 30 }, scene);
    options && options.position && options.position.y ? this.mesh.position.y = options.position.y : this.mesh.position.y = 7;
    options && options.position && options.position.z ? this.mesh.position.z = options.position.z : this.mesh.position.z = -150;
    this.mesh.rotation.x = Math.PI;
    this.mesh.material = materials.sprites.guy;
    this.mesh.isPickable = true;
    engine.runRenderLoop(() => {
      this.mesh.lookAt(camera.position, Math.PI);
    });
  }

  public talkTo() {
    GUI.openDialoge("Ramy", image, "Hello!");
  }
}
