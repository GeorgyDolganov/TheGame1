import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import {
  Engine,
} from '@babylonjs/core';
import './GUI/style/GUI.scss';
import GUI from './GUI';
import Player from './player';
import Scene0 from './scenes/scene0';

(global as any).OIMO = require('oimophysics');

class App {
  canvas: HTMLCanvasElement;

  engine: Engine;

  GUI: any;

  level: any;

  player: Player;

  createApp() {
    this.canvas = document.createElement('canvas');
    this.engine = new Engine(this.canvas, true);

    this.level = new Scene0(this.engine, this.canvas);
    this.player = new Player(this.canvas, this.level);

    this.GUI = GUI;
    this.GUI.createGUI();
    this.GUI.createDialogeGUI();
    this.GUI.createInteractGUI();

    this.canvas.style.width = '100%';
    this.canvas.style.height = '100vh';
    this.canvas.id = 'gameCanvas';
    document.body.appendChild(this.canvas);
    this.engine = new Engine(this.canvas, true);
  }
}

const app = new App();
export default app;
const startApp = () => {
  app.createApp();
};

startApp();
