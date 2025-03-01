
export default class Space {

    row: number; //it's row index of 0 - 8 in grid
    col: number; //it's column index of 0 - 8 in grid
    box: number; //it's 3x3 box index of 0 - in the grid (top 3 boxes are 0, 1 and 2, etc)
    value: number = 0; //value of Space in grid, 0 is empty value, 1-9 is filled value
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
    
    //remove a number from possible values left list
    removeNum(num: number) {
        if (this.numsLeft.indexOf(num) != -1){
            this.numsLeft.splice(this.numsLeft.indexOf(num), 1);
        }
    }

    //add possible value back if Space has filled value
    addNum(num: number) {
        if (this.value == 0 && this.numsLeft.indexOf(num) == -1){
            this.numsLeft.push(num);
        }
    }

    //when Space gets number, update value and make numsLeft empty
    fillSpace(value: number) {
        this.value = value;
        this.numsLeft = [];
    }

    //set value to 0, give list of possible values
    emptySpace(values: number[]) {
        this.value = 0;
        this.numsLeft = values;
    }
}