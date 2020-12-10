import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  UniversalCamera,
  Vector3,
  Mesh,
  ShadowGenerator,
  PointLight,
  AssetsManager,
  SpritePackedManager,
  Ray
} from "@babylonjs/core";
(global as any).OIMO = require("oimophysics");

import "./GUI/style/GUI.scss";
import Player from "./player";
import Scene0 from "./scenes/scene0";

class App {
  camera: UniversalCamera;
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;

  materials: any;

  GUI: {
    container: HTMLDivElement;
    dialoge: HTMLDivElement;
    interact: HTMLDivElement;
  };

  level: any;

  SPM: SpritePackedManager;
  assetsManager: AssetsManager;

  light1: PointLight;
  shadowGenerator: ShadowGenerator;

  player: Player;

  ground: Mesh;
  softSphere: Mesh;
  roof: Mesh;
  wall1: Mesh;
  wall2: Mesh;
  wall3: Mesh;
  wall4: Mesh;

  targetFPC: string;

  guy: Mesh;
  monster: Mesh;
  hand: Mesh;

  constructor() {

    this._createApp();

    this.level = new Scene0(this.engine, this.canvas);
    this.player = new Player(this.canvas, this.level.scene, this.level.camera);

    this._createGUI();
    this._createDialogeGUI();

  }

  private _createApp() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.id = "gameCanvas";
    document.body.appendChild(this.canvas);
    this.engine = new Engine(this.canvas, true);
    
  }

  private _createGUI() {
    this.GUI = {
      container: document.createElement("div"),
      interact: document.createElement("div"),
      dialoge: document.createElement("div")
    };
    this.GUI.container.setAttribute("id", "GUI");
    this.GUI.container.classList.add("GUI");
    document.body.appendChild(this.GUI.container);
    document.getElementById("GUI").appendChild(this.GUI.dialoge);
    document.getElementById("GUI").appendChild(this.GUI.interact);
  }

  private _createDialogeGUI() {
    this.GUI.dialoge.innerHTML = ``;
    this.GUI.dialoge.setAttribute("id", "dialoge");
    this.GUI.dialoge.classList.add("dialoge");
    this.GUI.dialoge.style.display = "none";
  }

  private _createInteractGUI() {
    this.GUI.interact.innerHTML = ``;
    this.GUI.interact.setAttribute("id", "interact");
    this.GUI.interact.classList.add("interact");
    this.GUI.interact.style.display = "none";
  }

  public openDialoge(name, img, text) {
    this.GUI.dialoge.innerHTML = `
    <div class="border">
      <div class="character">
        <div class="avatar">
          <div class="img" style="background-image: url('${img}')"></div>
        </div>
        <h2>${name}</h2>
      </div>
      <div class="text">
        <p>${text}</p>
      </div>  
    </div>
    <div class="tip">PRESS E TO CLOSE</div>`;
    this.GUI.dialoge.style.display = "flex";
  }

  public _closeDialoge() {
    this.GUI.dialoge.style.display = "none";
  }

  private _addDialogeControls() {
    let tryToTalk = () => {
      let origin = this.camera.position;
      let forward = this.camera.getFrontPosition(1);
      let direction = forward.subtract(origin);
      direction = Vector3.Normalize(direction);
      let length = 50;
      
      let ray = new Ray(origin,direction,length);

      let hit = this.scene.pickWithRay(ray);

      if (hit.pickedMesh && hit.pickedMesh.name.includes("char")) {
        this.targetFPC = hit.pickedMesh.name;
      } else {
        this.targetFPC = "";
      }

      let distanceFromCamera = 25;

      // if (this.player.talkingTo != "") {
      //   //TODO: Here we should call for a dialoge window;
      //   this.openDialoge("Ramy", char1, "Greetings mate'!");
      // }

    }
    this.scene.registerBeforeRender(() => {
      tryToTalk();
    });
    
    window.addEventListener("keypress", ev => {
      if (ev.key == "e" || ev.key == "E" || ev.key == "У" || ev.key == "у") {

      } 
    })
  }

}

new App();
