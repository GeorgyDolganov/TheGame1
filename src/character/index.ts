import { Mesh, MeshBuilder } from '@babylonjs/core';
import GUI from '../GUI';
import data from './dialogue/scene0.json';

export interface CharOptions {
  name: string,
  size: number,
  material: any,
  position: {
    y: number,
    x: number,
    z: number
  }
}

export interface AnimationOptions {
  rows: number,
  columns: number,
  frames: number,
  speed: number,
}

export class Character {
  mesh: Mesh;

  private defaultOptions: CharOptions = {
    name: 'char_Default',
    size: 30,
    material: undefined,
    position: {
      y: 30,
      x: 0,
      z: -150,
    },
  };

  private image: string;

  private dialogueCounter: number = 0;

  private dialogueState: number = 0;

  init(scene, image, options_?: CharOptions) {
    const options = { ...this.defaultOptions, ...options_ };
    this.mesh = MeshBuilder.CreatePlane(options.name, { size: options.size }, scene);
    this.mesh.position.set(options.position.x, options.position.y, options.position.z);
    this.mesh.material = options.material;
    this.mesh.isPickable = true;
    this.image = image;
    this.mesh.billboardMode = Mesh.BILLBOARDMODE_Y;
  }

  talkTo(id) {
    console.log(id);
    console.log(data);
    if (data[id] && this.dialogueCounter < data[id][this.dialogueState].length) {
      console.log(data[id][this.dialogueState][this.dialogueCounter]);
      GUI.openDialoge(id, this.image, data[id][this.dialogueState][this.dialogueCounter]);
      this.dialogueCounter += 1;
    } else {
      GUI.closeDialogue();
      this.dialogueCounter = 0;
    }
  }
}
