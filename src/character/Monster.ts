import image from '../materials/assets/textures/dungeonset/monster1.png';
import { Character, CharOptions } from './index';

export default class Monster extends Character {
  private defaultForMonster: CharOptions = {
    name: 'char_Monster',
    size: 30,
    material: undefined,
    position: {
      y: 7,
      x: 100,
      z: -150,
    },
  };

  constructor({
    scene, materials,
  }, options?: CharOptions) {
    super();
    this.defaultForMonster.material = materials.sprites.monster;
    this.init(scene, image, options || this.defaultForMonster);
  }
}
