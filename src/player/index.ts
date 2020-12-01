import Hand from "./hand";

export default class Player {
    public hand: Hand;

    constructor() {
        this.hand = new Hand(scene, camera);
    }
    
}