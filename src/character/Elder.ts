import { TimeInterval } from 'rxjs';
import image from '../materials/assets/animations/Elder.png';
import { Character, CharOptions, AnimationOptions } from './index';

export default class Elder extends Character {
  public animationInterval: any;

  private defaultForElder: CharOptions = {
    name: 'char_Elder',
    size: 30,
    material: undefined,
    position: {
      y: 6,
      x: 30,
      z: -90,
    },
  };

  constructor({
    scene, materials,
  }, animate: AnimationOptions, options?: CharOptions) {
    super();
    this.defaultForElder.material = materials.animations.elder.idle;
    this.init(scene, image, options || this.defaultForElder);
    if (animate) {
      let currentFrame = { x: 0, y: animate.rows - 1, i: 0 };
      this.animationInterval = setInterval(() => {
        if (currentFrame.i < animate.frames) {
          if (currentFrame.x < animate.columns) {
            this.defaultForElder.material.diffuseTexture.uOffset = 1 / (currentFrame.x + 1);
            this.defaultForElder.material.diffuseTexture.vOffset = 1 / (currentFrame.y + 1);
            currentFrame.x += 1;
          } else {
            currentFrame.y -= 1;
            currentFrame.x = 0;
            this.defaultForElder.material.diffuseTexture.uOffset = 1 / (currentFrame.x + 1);
            this.defaultForElder.material.diffuseTexture.vOffset = 1 / (currentFrame.y + 1);
          }
          currentFrame.i += 1;
        } else currentFrame = { x: 0, y: animate.rows - 1, i: 0 };
      }, animate.speed);
    }
  }
}
