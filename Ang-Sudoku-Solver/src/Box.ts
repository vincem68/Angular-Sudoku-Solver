/**
 * This is a Box class that represents the 9 boxes of a Sodoku grid.
 * The attributes of the Box class are as follows:
 *  
 *  1. numsLeft - an array of numbers that need to be added into the box. The numbers are 0-9 and
 *  only appear in the list once.
 * 
 *  2. adjRow1, adjRow2, adjRow3 - these contain integers that are used as indexes for the relative
 *  rows of the box. For example, the top 3 boxes in the Sodoku grid will have adjRow1 as 0, adjROw2
 *  as 1, and adjRow3 as 2. This makes it easier to look at whole rows to see if a number is already 
 *  in it before inserting it into the box. 
 * 
 *  3. adjColumn1, adjColumn2, adjColumn3 - these contain integers that are used as indexes for the
 *  relative columns for the box. For example, the upper left box will have columns 0, 1, and 2, as     
 *  will the boxes below it since they're all on the left side of the overall grid. This is used for
 *  a Columns 2D array so we can look up whole columns easier to see if a number is already in it
 *  before inserting a number into the box.
 * 
 *  4. next - a reference to the next box in the order. The boxes will be ordered in a linked list from
 *  left to right, top to bottom (like reading a book). So, the upper left box will be first in the list,
 *  the upper middle box 2nd, the upper right third, middle left 4th, etc.
 * 
 */
export default class Box {

    numsLeft: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    adjRow1: number;
    adjRow2: number;
    adjRow3: number;
    adjColumn1: number;
    adjColumn2: number;
    adjColumn3: number;

    next: Box | null = null;

    constructor(adjRows: number[], adjColumns: number[]){
        this.adjRow1 = adjRows[0];
        this.adjRow2 = adjRows[1];
        this.adjRow3 = adjRows[2];
        this.adjColumn1 = adjColumns[0];
        this.adjColumn2 = adjColumns[1];
        this.adjColumn3 = adjColumns[2];
    }

    /**
     * This method will add the number into the box and remove it from the list of numbers
     * needed to be filled in
     * @param {*} num number to be filled into box
     */
    fillSpace(num: number): void {
        const index = this.numsLeft.indexOf(num);
        if (index > -1){
            this.numsLeft.splice(index, 1);
        }
    }
    
}