import Hand from "./hand";
import { addFirstPersonControls, addPickingUpControls } from "./controlls";
export default class Player {
    public data: {
        hand?: Hand;
        holdingObject?: string;
    }
    public target: any;
    constructor(canvas, scene, camera) {
        this.data = {
            hand: new Hand(scene, camera),
            holdingObject: "",
        }
        addFirstPersonControls(canvas,scene,camera);
       this.target = addPickingUpControls(scene,camera, this.data);
    }
    
}