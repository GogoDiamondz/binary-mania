export class Player {
    constructor(name, yourWins = null, friendWins = null, isFriend = false) {
        this.name = name;
        this.yourWins = yourWins;
        this.friendWins = friendWins;
        this.isFriend = isFriend;
    }
}