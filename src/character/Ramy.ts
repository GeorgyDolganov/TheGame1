import image from '../materials/assets/textures/dungeonset/char1.png';
import { Character, CharOptions } from './index';

export default class Ramy extends Character {
  private defaultForChar: CharOptions = {
    name: 'char_Ramy',
    size: 10,
    material: undefined,
    position: {
      y: -3,
      x: 10,
      z: -120,
    },
  };

  constructor({
    scene, materials,
  }, options?: CharOptions) {
    super();
    this.defaultForChar.material = materials.sprites.guy;
    this.init(scene, image, options || this.defaultForChar);
  }
}
