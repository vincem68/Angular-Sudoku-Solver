import Space from "./classes/Space";

/**
 * @param rowGrid 2D Space array to store Space objects in Row order (regular grid)
 * @param colGrid 2D grid to store Space objects in Column order
 * @param boxGrid 2D grid to store Space objects in Box order
 * @param numsLeftTable 2D array that stores unfilled Spaces in order of least remaining values (index 0 has
 * spaces with only 1 value left, index 1 with 2 values, etc.)
 * @returns void
 */

export default function solve(rows: Space[][], columns: Space[][], boxes: Space[][], numsLeftTable: Space[][]) {

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
                    || space.col == removedSpace.col || space.box == removedSpace.box).reverse();
                
                for (let j = 0; j < updatedSpaces.length; j++){
                    updatedSpaces[j].removeNum(removedSpace.value);

                    if (updatedSpaces[j].numsLeft.length == 0){
                        return;
                    }
                    else if (updatedSpaces[j].numsLeft.length == i){ 
                        numsLeftTable[i - 1].push(updatedSpaces[j]); //move the space to the list above it
                        numsLeftTable[i].splice(numsLeftTable[i].findIndex(otherSpace => 
                            otherSpace === updatedSpaces[j]), 1);
                    }
                }
            }
            
        } else { //if no spaces remain with only 1 value remaining, narrow down spaces
            //space that we narrowed down a value for
            const narrowedSpace = narrowDownSpaces(rows, columns, boxes);
            //if no narrowed space, it means we need to take a guess at a space
            if (!narrowedSpace){
                //go through every space and their possible values, make guess on recursive call
                for (let i = 1; i < 9; i++){ //for every row starting with spaces with 2 values left
                    for (let j = 0; j < numsLeftTable[i].length; j++){ //for every space in index
                        for (let k = 0; k < numsLeftTable[i][j].numsLeft.length; k++){ //for every value left in space
                            //make a copy of the grids for recursive call
                            const dupRows: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupCols: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupBoxes: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupNumsLeftTable: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            //fill each grid with duplicate objects
                            rows.forEach(row => {
                                row.forEach(space => {
                                    const newSpace = new Space(space.row, space.col, space.value);
                                    newSpace.numsLeft = space.numsLeft.slice();
                                    dupRows[newSpace.row].push(newSpace);
                                    dupCols[newSpace.col].push(newSpace);
                                    dupBoxes[newSpace.box].push(newSpace);
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
                            solve(dupRows, dupCols, dupBoxes, dupNumsLeftTable);
                            //check if finished call resulted in a finished solution without contradictions
                            if (dupNumsLeftTable.filter(list => list.length > 0).length == 0) {
                                for (let x = 0; x < 9; x++){
                                    for (let y = 0; y < 9; y++){
                                        rows[x][y] = dupRows[x][y];
                                        columns[x][y] = dupCols[x][y];
                                        boxes[x][y] = dupBoxes[x][y];
                                    }
                                    numsLeftTable[x] = [];
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
 * that box, row or column that has a specific number left to be filled. Returns the first occurrence
 * of such space or null if not found
 */
function narrowDownSpaces(rows: Space[][], columns: Space[][], boxes: Space[][]) {
    //go through each box
    for (let i = 0; i < 9; i++){
        //filter out the numbers left to be filled in the box
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        boxes[i].forEach(space => { if (space.value != 0){
            unfilledNums.splice(unfilledNums.indexOf(space.value), 1);
        }});
        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        for (let j = 0; j < unfilledNums.length; j++){
            const narrowedSpaces = boxes[i].filter(space => space.numsLeft.includes(unfilledNums[j]));
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
        rows[i].forEach(space => { if (space.value != 0){
            unfilledNums.splice(unfilledNums.indexOf(space.value), 1);
        }});
        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        for (let j = 0; j < unfilledNums.length; j++){
            const narrowedSpaces = rows[i].filter(space => space.numsLeft.includes(unfilledNums[j]));
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
        columns[i].forEach(space => { if (space.value != 0){
            unfilledNums.splice(unfilledNums.indexOf(space.value), 1);
        }});
        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        for (let j = 0; j < unfilledNums.length; j++){
            const narrowedSpaces = columns[i].filter(space => space.numsLeft.includes(unfilledNums[j]));
            if (narrowedSpaces.length == 1){
                const index = narrowedSpaces[0].numsLeft.length - 1; 
                narrowedSpaces[0].numsLeft = [unfilledNums[j]];
                return {"index": index, "space": narrowedSpaces[0]};
            }
        }
    }
    //if no space found, return null
    return null;
}