import { NumberSymbol } from "@angular/common";
import Space from "./classes/Space";

export default function prepareSolve(rows: number[][], columns: number[][]){

    //create the 2D arrays to store the Space objects. 
    const rowGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
    const colGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
    const boxGrid: Space[][] = [[],[],[],[],[],[],[],[],[]]; 
    const numsLeftTable: Space[][] = [[],[],[],[],[],[],[],[],[]];

    //create the Spaces for every value, and add them to the grids. Also put together boxValues 
    const boxValues: number[][] = [[],[],[],[],[],[],[],[],[]];
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            const space = new Space(i, j, rows[i][j]);
            rowGrid[i].push(space);
            colGrid[j].push(space);
            boxGrid[space.box].push(space);
            //add in nonzero values to boxlist so we can use it to filer out numsLeft lists
            if (rows[i][j] != 0){
                boxValues[space.box].push(rows[i][j]);
            }
        }
    }
    //narrow down numsLeft list of any unfilled Spaces to only possible remaining values
    rowGrid.forEach(row => {
        row.forEach(space => {
            if (space.numsLeft.length > 1){ //if space has no value filled
                space.numsLeft = space.numsLeft.filter(value => !boxValues[space.box].concat(rows[space.row]
                    .filter(num => num != 0)).concat(columns[space.col].filter(num => num != 0)).includes(value));
                
                numsLeftTable[space.numsLeft.length - 1].push(space);
            } 
        });
    });
    //call solve to find the solution
    solve(rowGrid, colGrid, boxGrid, numsLeftTable);
    //populate the numerical rows grid with the final Space values
    rowGrid.forEach(row => {row.forEach(space => { rows[space.row][space.col] = space.value; });});
    colGrid.forEach(col => {col.forEach(space => { columns[space.col][space.row] = space.value; });});
}

/**
 * 
 * @param rowGrid 2D Space array to store Space objects in Row order (regular grid)
 * @param colGrid 2D grid to store Space objects in Column order
 * @param boxGrid 2D grid to store Space objects in Box order
 * @param numsLeftTable 2D array that stores unfilled Spaces in order of least remaining values (index 0 has
 * spaces with only 1 value left, index 1 with 2 values, etc.)
 * @returns void
 */
function solve(rowGrid: Space[][], colGrid: Space[][], boxGrid: Space[][], numsLeftTable: Space[][]) {

    while (1) {
        //if numsLeftTable is completely empty, no more spaces left to fill
        if (numsLeftTable.filter(list => list.length > 0).length == 0){ return; }
        //look for any spaces that only have one value left, update adjacent spaces
        if (numsLeftTable[0].length > 0) {

            const removedSpace = numsLeftTable[0].pop()!;
            removedSpace.fillSpace();

            //update the rest of the remaining spaces in the spaceTable
            for (let i = 0; i < 9; i++){
                //list that has spaces that lose that num as a possible value
                const updatedSpaces = numsLeftTable[i].filter(space => space.row == removedSpace.row 
                    || space.col == removedSpace.col || space.box == removedSpace.box);
                
                let foundContradiction = false; //if we find a space with no possible values left, invalid
                updatedSpaces.reverse().forEach(space => { //for each element:

                    space.removeNum(removedSpace.value); //remove the number from its possible value list

                    //if the space's numsLeft list is empty, means puzzle is bad or a guess reached dead end
                    if (space.numsLeft.length == 0){
                        foundContradiction = true;
                        return;
                    }
                    //otherwise move space up list if a possible value was removed
                    else if (space.numsLeft.length == i){ 
                        numsLeftTable[i - 1].push(space); //move the space to the list above it
                        numsLeftTable[i].splice(numsLeftTable[i].findIndex(otherSpace => otherSpace === space), 1);
                    }
                });
                //return from this call if we found a contradiction
                if (foundContradiction){ return; }
            }
            
        } else { //if no spaces remain with only 1 value remaining, narrow down spaces
            //list of spaces that we narrowed down a value for
            const narrowedSpace = narrowDownSpaces(rowGrid, colGrid, boxGrid);
            //if no narrowed space, it means we need to take a guess at a space
            if (!narrowedSpace){
                //go through every space and their possible values, make guess on recursive call
                for (let i = 1; i < 9; i++){ //for every row starting with spaces with 2 values left
                    for (let j = 0; j < numsLeftTable[i].length; j++){ //for every space in index
                        for (let k = 0; k < numsLeftTable[i][j].numsLeft.length; k++){ //for every value left in space
                            //make a copy of the grids for recursive call
                            const dupRowGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupColGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupBoxGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupNumsLeftTable: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            //fill each grid with duplicate objects
                            rowGrid.forEach(row => {
                                row.forEach(space => {
                                    const newSpace = new Space(space.row, space.col, space.value);
                                    newSpace.numsLeft = space.numsLeft.slice();
                                    dupRowGrid[newSpace.row].push(newSpace);
                                    dupColGrid[newSpace.col].push(newSpace);
                                    dupBoxGrid[newSpace.box].push(newSpace);
                                    if (newSpace.row == numsLeftTable[i][j].row && newSpace.col == numsLeftTable[i][j].col){
                                        newSpace.numsLeft = [numsLeftTable[i][j].numsLeft[k]];
                                        dupNumsLeftTable[0].push(newSpace);
                                    }
                                    else if (newSpace.numsLeft.length > 0) {
                                        dupNumsLeftTable[newSpace.numsLeft.length - 1].push(newSpace);
                                    }
                                });
                            });
                            //recursive call the guess attempt
                            solve(dupRowGrid, dupColGrid, dupBoxGrid, dupNumsLeftTable);
                            //check if finished call resulted in a finished solution without contradictions
                            let finished = true;
                            dupRowGrid.forEach(row => {
                                row.forEach(space => {
                                    if (space.numsLeft.length > 1) { finished = false; }
                                });
                            });
                            if (finished){
                                for (let i = 0; i < 9; i++){
                                    for (let j = 0; j < 9; j++){
                                        rowGrid[i][j] = dupRowGrid[i][j];
                                        colGrid[i][j] = dupColGrid[i][j];
                                        boxGrid[i][j] = dupBoxGrid[i][j];
                                    }
                                }
                                return;
                            }
                        }
                    }
                }
                return; //we reached dead end, no recursive calls resulted in valid solution
            }
            //if we have narrowed down space, move to top index and remove it from current index
            numsLeftTable[0].push(narrowedSpace.space);
            numsLeftTable[narrowedSpace.index].splice(numsLeftTable[narrowedSpace.index]
                .findIndex(space => space === narrowedSpace.space), 1);
        }
    }
}

/**
 * This function is used whenever we don't have any spaces that only have 1 possible value remaining.
 * The goal of this function is to check every box, row, and column if there's only 1 space within
 * that box, row or column that has a specific number left to be filled
 */
function narrowDownSpaces(rowGrid: Space[][], colGrid: Space[][], boxGrid: Space[][]) {

    //go through each box
    for (let i = 0; i < 9; i++){
        //filter out the numbers left to be filled in the box
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        boxGrid[i].forEach(space => { if (space.value != 0){
            unfilledNums.splice(unfilledNums.indexOf(space.value), 1);
        }});
        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        for (let j = 0; j < unfilledNums.length; j++){
            const narrowedSpaces = boxGrid[i].filter(space => space.numsLeft.includes(unfilledNums[j]));
            if (narrowedSpaces.length == 1){
                const index = narrowedSpaces[0].numsLeft.length - 1; 
                narrowedSpaces[0].numsLeft = [unfilledNums[j]];
                return {"index": index, "space": narrowedSpaces[0]};
            }
        }
    }

    //go through each row
    for (let i = 0; i < 9; i++){
        //filter out the numbers left to be filled in the row
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        rowGrid[i].forEach(space => { if (space.value != 0){
            unfilledNums.splice(unfilledNums.indexOf(space.value), 1);
        }});
        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        for (let j = 0; j < unfilledNums.length; j++){
            const narrowedSpaces = rowGrid[i].filter(space => space.numsLeft.includes(unfilledNums[j]));
            if (narrowedSpaces.length == 1){
                const index = narrowedSpaces[0].numsLeft.length - 1; 
                narrowedSpaces[0].numsLeft = [unfilledNums[j]];
                return {"index": index, "space": narrowedSpaces[0]};
            }
        }
    }

    //go through each column
    for (let i = 0; i < 9; i++){
        //filter out the numbers left to be filled in the column
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        colGrid[i].forEach(space => { if (space.value != 0){
            unfilledNums.splice(unfilledNums.indexOf(space.value), 1);
        }});
        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        for (let j = 0; j < unfilledNums.length; j++){
            const narrowedSpaces = colGrid[i].filter(space => space.numsLeft.includes(unfilledNums[j]));
            if (narrowedSpaces.length == 1){
                const index = narrowedSpaces[0].numsLeft.length - 1; 
                narrowedSpaces[0].numsLeft = [unfilledNums[j]];
                return {"index": index, "space": narrowedSpaces[0]};
            }
        }
    }

    return null;
}