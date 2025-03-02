export default class Space {

    row: number;
    col: number;
    box: number;
    value: number = 0;
    numsLeft: number[] = [1,2,3,4,5,6,7,8,9];

    constructor(row: number, col: number, value: number) {
        this.row = row;
        this.col = col;
        this.box = 3 * Math.floor(row / 3) + Math.floor(col / 3);
        if (value != 0){
            this.value = value;
            this.numsLeft = [];
        }
    }

    removeNum(num: number) {
        if (this.numsLeft.indexOf(num) != -1){
            this.numsLeft.splice(this.numsLeft.indexOf(num), 1);
        }
    }

    fillSpace(value?: number) {
        this.value = (value) ? value : this.numsLeft[0];
        this.numsLeft = [];
    }

    //add possible value back if Space has filled value
    addNum(num: number) {
        if (this.value == 0 && this.numsLeft.indexOf(num) == -1){
            this.numsLeft.push(num);
        }
    }

    //set value to 0, give list of possible values
    emptySpace(values: number[]) {
        this.value = 0;
        this.numsLeft = values;
    }

}