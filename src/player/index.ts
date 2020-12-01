import Hand from "./hand";

export default class Player {
    public hand: Hand;

    constructor(scene, camera) {
        this.hand = new Hand(scene, camera);
    }
    
}