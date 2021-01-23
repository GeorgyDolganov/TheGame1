import Hand from './hand';
import { addFirstPersonControls, addPickingUpControls, addDialogeControls } from './controlls';

export default class Player {
  public data: {
    hand?: Hand;
    holdingObject?: string;
  };

  public target: any;

  constructor(canvas, level) {
    this.data = {
      hand: new Hand(level.scene, level.camera),
      holdingObject: '',
    };
    addFirstPersonControls(canvas, level.scene, level.camera);
    addPickingUpControls(level.scene, level.camera, this.data);
    addDialogeControls(level, this.data);
  }
}
