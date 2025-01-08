import { Injectable } from '@angular/core';
import {Box} from '../Box.ts'

@Injectable({
  providedIn: 'root'
})
export class SolveService {

  constructor() { }


/**
 * This is the main function that solves the Sodoku puzzle. 
 * The algorithm goes like this:
 * 
 * We create another 2D array that is a transpose of the inputted rows 2D array, and this new grid
 * represents the columns meant for easier lookup of numbers in a certain column. We then create the 
 * 9 boxes of the Sodoku grid and put them all in a circular linked list, with the head box being the
 * upper left box in the grid (order of the boxes goes from left to right, then top to bottom). We 
 * then start at the headBox box and go around the list, looking at each box to see if we can fill in 
 * a number into said box based off of that box's numsLeft list. We look at every number in the box's
 * list and try to insert it, and if we can, update both the rows and columns grids and remove that 
 * number from the box's list. Once we can't fit in any more numbers, or we filled in the box entirely,
 * we move on to the next box. If the box is full, we remove it from the list so we don't visit it
 * again. The algorithm ends when we only have headBox left in the list and we finish that box as well.
 * 
 * @param {*} rows - a 2D array that represents the entire grid. It also represents the rows of the
 * grid.
 * 
 */
export default function solve(rows){

    //this segment will create the 2D array to represent the columns
    const columns = [[],[],[],[],[],[],[],[],[]]
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            columns[i].push(rows[j][i]); // Swap rows and columns
        }
    }

    //initialize the circular linked list for the boxes
    const box_table = createBoxList(rows);
    let headBox = box_table[0]; let prevBox = box_table[8];

    //start solving the puzzle
    let crntBox = headBox; let lastChangedBox = null;
    
    
    while (headBox != null){

        //if we go around the whole remaining list and no changes have been made
        if (lastChangedBox === crntBox){
            checkRowsAndColumnsForSpaces(rows, columns, box_table);
        }
        
        if (lastChangedBox == null){
            lastChangedBox = crntBox;
        }

        let initialListLength = crntBox.numsLeft.length;
        while (1){
            checkForAvailableSpace(crntBox, rows, columns);
            if (initialListLength == crntBox.numsLeft.length) { break; }
            initialListLength = crntBox.numsLeft.length;
            lastChangedBox = crntBox;
        }

        //here we free the box if its finished, or move on to the next one
        if (crntBox.numsLeft.length == 0){

            if (crntBox === headBox){ //if we are at the starting box

                if (crntBox.next === headBox){ // if this is the last Box left, break the loop
                    headBox = null; crntBox = null;
                    continue;

                } else { //if this is not the last box left, move headBox right
                    headBox = headBox.next;
                    crntBox = headBox;
                    prevBox.next = crntBox;
                }

            } else {  //eliminate the Box from list as normal
                crntBox = crntBox.next;
                prevBox.next = crntBox;
            }
            lastChangedBox = null; 

        } else { //move to next box
            prevBox = crntBox;
            crntBox = crntBox.next;
        }
    } 

}


/**
 * This function creates the linked list of the boxes
 * @returns A reference to the start of the Box linked list
 * 
 * this function should be COMPLETE
 */
function createBoxList(rows){

    const box_table = [];

    //this fills the boxes with their corresponding row and column indexes to provide us easy lookup 
    //in the overall row and column 2D arrays
    for (let i = 0; i < 9; i += 3){
        for (let j = 0; j < 9; j += 3){
            ;
            const box = new Box([i, i + 1, i + 2], [j, j + 1, j + 2]);
           
            //make sure the box's numsLeft list is updated
            box.fillSpace(rows[box.adjRow1][box.adjColumn1]);
            box.fillSpace(rows[box.adjRow1][box.adjColumn2]);
            box.fillSpace(rows[box.adjRow1][box.adjColumn3]);
            box.fillSpace(rows[box.adjRow2][box.adjColumn1]);
            box.fillSpace(rows[box.adjRow2][box.adjColumn2]);
            box.fillSpace(rows[box.adjRow2][box.adjColumn3]);
            box.fillSpace(rows[box.adjRow3][box.adjColumn1]);
            box.fillSpace(rows[box.adjRow3][box.adjColumn2]);
            box.fillSpace(rows[box.adjRow3][box.adjColumn3]);

            box_table.push(box); //add the box to the list table
        }
    }

    //connect all the boxes together
    for (let i = 0; i < 9; i++){
        box_table[i].next = (i == 8) ? box_table[0] : box_table[i + 1];
    }

    return box_table; //return the box table
}


/**
 * The purpose of this function is to see if there is an available space we can fill in a number
 * while also ensuring it is the only space we can place that number in the box
 * 
 * The idea: the first 3 if statements check to see if we have the number in the 3 entire rows of the 
 * overall grid where the box is located. If it is, we skip that row. If not, we add a tuple of the
 * coords for the row into spaceIndexes. Then we check the columns if the number is in it, and if so, 
 * we take any tuple of a space out that has the same column index. We then finally check if we only 
 * have one valid space left and if so, we add the number into the two grids and update the numsLeft
 * list of the box.
 * 
 * @param {*} box - the Box object we are currently looking at
 * @param {*} num - the number we are attempting to fill in
 * @param {*} rows - the 2D array of the rows to check horizontally adjacant boxes
 * @param {*} columns - the 2D array of columns to check vertically adjacent boxes
 */
function checkForAvailableSpace(box, rows, columns){

    for (let i = 0; i < box.numsLeft.length; i++){

        const num = box.numsLeft[i];

        let spaceIndexes = [];

        //check to see what available spaces we have in the box for the number. First check the rows.
        if (!rows[box.adjRow1].includes(num)){
            new Array([box.adjRow1, box.adjColumn1], [box.adjRow1, box.adjColumn2], [box.adjRow1, box.adjColumn3])
            .map(space => {
                if (rows[space[0]][space[1]] == 0) { spaceIndexes.push(space);}
            });
        }
        if (!rows[box.adjRow2].includes(num)){
            new Array([box.adjRow2, box.adjColumn1], [box.adjRow2, box.adjColumn2], [box.adjRow2, box.adjColumn3])
            .map(space => {
                if (rows[space[0]][space[1]] == 0) { spaceIndexes.push(space);}
            });
        }
        if (!rows[box.adjRow3].includes(num)){
            new Array([box.adjRow3, box.adjColumn1], [box.adjRow3, box.adjColumn2], [box.adjRow3, box.adjColumn3])
            .map(space => {
                if (rows[space[0]][space[1]] == 0) { spaceIndexes.push(space);}
            });
        }

        //now, check the columns to knock out any unavailable spaces we counted
        if (columns[box.adjColumn1].includes(num)){
            spaceIndexes = spaceIndexes.filter(space => space[1] != box.adjColumn1);
        }
        if (columns[box.adjColumn2].includes(num)){
            spaceIndexes = spaceIndexes.filter(space => space[1] != box.adjColumn2);
        }
        if (columns[box.adjColumn3].includes(num)){
            spaceIndexes = spaceIndexes.filter(space => space[1] != box.adjColumn3);
        }

        //update both the Box's numsLeft list and update the rows and columns grids
        if (spaceIndexes.length == 1){
            rows[spaceIndexes[0][0]][spaceIndexes[0][1]] = num;
            columns[spaceIndexes[0][1]][spaceIndexes[0][0]] = num;
            box.fillSpace(num);
            return;
        }
    }
}


/**\
 * This method is used when we can't find any spaces to fill in a number with the usual way of going through
 * each box. When we cycle through the entire linked list of boxes and see no changes have been made since the
 * last box that had changes, we call this method.
 * 
 * The process is going through each row and column once to find spaces we can put numbers into. We look at
 * the empty spaces in each row/column, what numbers are needed still in each row/column, and try to rule out 
 * possible spaces based on of the space is in a box that already has said number or if the space is in a row/
 * column that already has the number. The number is filled when only one possible space remains for the number. 
 */
function checkRowsAndColumnsForSpaces(rows, columns, box_table){
    
    //first go through every row
    for (let i = 0; i < 9; i++){

        //the inital list of nums we still need in the row
        let availableNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !rows[i].includes(num));

        //go through every missing number
        for (let j = 0; j < 9; j++){

            const num = availableNums[j];

            //the empty spaces of the row column wise
            let spaceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(index => rows[i][index] == 0);

            //find if we can eliminate possible spaces by seeing if number is already in a box
            const box_index = Math.floor(i/3) * 3;
            if (!box_table[box_index].numsLeft.includes(num)){
                spaceIndexes = spaceIndexes.filter(index => index > 2);
            }
            if (!box_table[box_index + 1].numsLeft.includes(num)){
                spaceIndexes = spaceIndexes.filter(index => index < 3 || index > 5);
            }
            if (!box_table[box_index + 2].numsLeft.includes(num)){
                spaceIndexes = spaceIndexes.filter(index => index < 6);
            }

            //now check the columns to make sure we can put it there
            spaceIndexes = spaceIndexes.filter(index => !columns[index].includes(num));


            //see if we only have one spot left for the number.
            if (spaceIndexes.length == 1){

                //update rows and columns
                rows[i][spaceIndexes[0]] = num;
                columns[spaceIndexes[0]][i] = num;

                //here we update the box of where the space is in
                box_table[Math.floor(i/3) * 3 + Math.floor(spaceIndexes[0]/3)].fillSpace(num);

                i -= 1;
                break;
            }
        }

    }

    //now go through every column
    for (let i = 0; i < 9; i++){

        //the inital list of nums we still need in the row
        let availableNums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !columns[i].includes(num));

        //go through every missing number
        for (let j = 0; j < 9; j++){

            const num = availableNums[j];

            //the empty spaces of the row column wise
            let spaceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(index => columns[i][index] == 0);

            //find if we can eliminate possible spaces by seeing if number is already in a box
            const box_index = Math.floor(i/3);
            if (!box_table[box_index].numsLeft.includes(num)){
                spaceIndexes = spaceIndexes.filter(index => index > 2);
            }
            if (!box_table[box_index + 3].numsLeft.includes(num)){
                spaceIndexes = spaceIndexes.filter(index => index < 3 || index > 5);
            }
            if (!box_table[box_index + 6].numsLeft.includes(num)){
                spaceIndexes = spaceIndexes.filter(index => index < 6);
            }

            //now check the rows to make sure we can put it there
            spaceIndexes = spaceIndexes.filter(index => !rows[index].includes(num));


            //see if we only have one spot left for the number.
            if (spaceIndexes.length == 1){

                //update rows and columns
                rows[spaceIndexes[0]][i] = num;
                columns[i][spaceIndexes[0]] = num;

                //here we update the box of where the space is in
                box_table[Math.floor(i/3) + Math.floor(spaceIndexes[0]/3) * 3].fillSpace(num);

                //check the row again if we can put in more numbers after filling one in
                i -= 1;
                break;
            }
        }

    }
}
