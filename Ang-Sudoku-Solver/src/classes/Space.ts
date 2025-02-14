
export default class Space {

    row: number;
    col: number;
    box: number;
    numsLeft: number[] = [1,2,3,4,5,6,7,8,9];

    constructor(row: number, col: number, value: number) {
        this.row = row;
        this.col = col;
        this.box = 3 * Math.floor(row / 3) + Math.floor(col / 3);
        if (value != 0){
            this.numsLeft = [value];
        }
    }

    removeNum(num: number) {
        if (this.numsLeft.indexOf(num) != -1 && this.numsLeft.length > 1){
            this.numsLeft.splice(this.numsLeft.indexOf(num), 1);
        }
    }

    static getBoxIndex(row: number, col: number){
        return 3 * Math.floor(row / 3) + Math.floor(col / 3);
    }
}