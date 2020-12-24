import { Mesh, MeshBuilder } from "@babylonjs/core";
import GUI from "../GUI";
import image from "../materials/assets/textures/dungeonset/monster1.png";
export default class Monster {
  mesh: Mesh;
  constructor({engine, scene, camera, materials}, options?: {size?, position?:{y?,x?,z?}}) {
    this.mesh = MeshBuilder.CreatePlane("char_Monster", { size: options && options.size ? options.size : 50 }, scene);
    options && options.position && options.position.y ? this.mesh.position.y = options.position.y : this.mesh.position.y = 20;
    options && options.position && options.position.z ? this.mesh.position.z = options.position.z : this.mesh.position.z = -200;
    this.mesh.rotation.x = Math.PI;
    this.mesh.material = materials.sprites.monster;
    this.mesh.isPickable = true;
    engine.runRenderLoop(() => {
      this.mesh.lookAt(camera.position, Math.PI);
    });
  }

  public talkTo() {
    GUI.openDialoge("Monster", image, "I'm going to eat you humie'");
  }
}
