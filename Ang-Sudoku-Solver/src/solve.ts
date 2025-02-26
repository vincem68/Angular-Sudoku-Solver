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
    rowGrid.forEach(row => {row.forEach(space => { rows[space.row][space.col] = space.numsLeft[0]; });});
    colGrid.forEach(col => {col.forEach(space => { columns[space.col][space.row] = space.numsLeft[0]; });});
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

            const removedSpace = numsLeftTable[0].pop();
            const num = removedSpace?.numsLeft[0]!;

            //update the rest of the remaining spaces in the spaceTable
            for (let i = 0; i < 9; i++){
                //list that has spaces that lose that num as a possible value
                const updatedSpaces = numsLeftTable[i].filter(space => space.row == removedSpace?.row 
                    || space.col == removedSpace?.col || space.box == removedSpace?.box);
                
                let foundContradiction = false; //if we find a space with no possible values left, invalid
                updatedSpaces.reverse().forEach(space => { //for each element:

                    space.removeNum(num); //remove the number from its possible value list

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
            const filledSpaces = narrowDownSpaces(rowGrid, colGrid, boxGrid);
            //if the list is empty, it means we need to take a guess at a space
            if (filledSpaces.length == 0){
                //go through every space and their possible values, make guess on recursive call
                for (let i = 1; i < 9; i++){ //for every row starting with spaces with 2 values left
                    for (let j = 0; j < numsLeftTable[i].length; j++){ //for every space in index
                        for (let k = 0; k < numsLeftTable[i][j].numsLeft.length; k++){ //for every value left in space
                            const guess = new Space(numsLeftTable[i][j].row, numsLeftTable[i][j].col, 
                                numsLeftTable[i][j].numsLeft[k]);
                            //make a copy of the grids for recursive call
                            const dupRowGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupColGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupBoxGrid: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            const dupNumsLeftTable: Space[][] = [[],[],[],[],[],[],[],[],[]];
                            //put current guess in tables
                            dupRowGrid[guess.row].push(guess);
                            dupColGrid[guess.col].push(guess);
                            dupBoxGrid[guess.box].push(guess);
                            dupNumsLeftTable[0].push(guess);
                            //fill each grid with duplicate objects
                            rowGrid.forEach(row => {
                                row.forEach(space => {
                                    if (space.row != guess.row || space.col != guess.col){
                                        const newSpace = new Space(space.row, space.col, 0);
                                        newSpace.numsLeft = space.numsLeft.slice();
                                        dupRowGrid[newSpace.row].push(newSpace);
                                        dupColGrid[newSpace.col].push(newSpace);
                                        dupBoxGrid[newSpace.box].push(newSpace);
                                        if (newSpace.numsLeft.length > 1) {
                                            dupNumsLeftTable[newSpace.numsLeft.length - 1].push(newSpace);
                                        }
                                    }
                                });
                            });
                            //recursive call the guess attempt
                            solve(dupRowGrid, dupColGrid, dupBoxGrid, dupNumsLeftTable);
                            //check if finished call resulted in a finished solution without contradictions
                            if (dupNumsLeftTable.filter(list => list.length > 0).length == 0){
                                rowGrid = dupRowGrid;
                                colGrid = dupColGrid;
                                boxGrid = dupBoxGrid;
                                numsLeftTable = dupNumsLeftTable;
                                return;
                            }
                        }
                    }
                }
                return; //we reached dead end, no recursive calls resulted in valid solution
            }
            //if we have narrowed down spaces, move them to top index and remove them from current indexes
            filledSpaces.forEach(spaceInfo => {
                //remove Space from its initial position in numsLeftGrid and move it to the top
                numsLeftTable[spaceInfo[0]]
                    .splice(numsLeftTable[spaceInfo[0]].findIndex(otherSpace => otherSpace === spaceInfo[1]), 1);
                numsLeftTable[0].push(spaceInfo[1]); //put to top
            });
        }
    }
}

/**
 * This function is used whenever we don't have any spaces that only have 1 possible value remaining.
 * The goal of this function is to check every box, row, and column if there's only 1 space within
 * that box, row or column that has a specific number left to be filled
 */
function narrowDownSpaces(rowGrid: Space[][], colGrid: Space[][], boxGrid: Space[][]) {

    //array that holds tuples. Tuples represent the info of spaces to be updated. contains number (index 
    //of where space initially is in numsLeftGrid) and the Space itself
    const filledSpaces: [number, Space][] = [];

    //go through each box
    boxGrid.forEach(box => {
        //filter out the numbers left to be filled in the box
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        box.forEach(space => {if (space.numsLeft.length == 1){
            unfilledNums.splice(unfilledNums.indexOf(space.numsLeft[0]), 1);
        }});

        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        unfilledNums.forEach(num => {
            const spaces: Space[] = []; //spaces that include the number as possible value
            box.forEach(space => {if (space.numsLeft.includes(num)){spaces.push(space);}});
            if (spaces.length == 1){ //if only one space in box has this num as a possible value, fill it in
                filledSpaces.push([spaces[0].numsLeft.length - 1, spaces[0]]);
                spaces[0].numsLeft = [num];
            }
        });
    });

    //go through each row
    rowGrid.forEach(row => {
        //filter out the numbers left to be filled in the row
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        row.forEach(space => {if (space.numsLeft.length == 1){
            unfilledNums.splice(unfilledNums.indexOf(space.numsLeft[0]), 1);
        }});

        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        unfilledNums.forEach(num => {
            const spaces: Space[] = []; //spaces that include the number as possible value
            row.forEach(space => {if (space.numsLeft.includes(num)){spaces.push(space);}});
            if (spaces.length == 1){ //if only one space in row has this num as a possible value, fill it in
                filledSpaces.push([spaces[0].numsLeft.length - 1, spaces[0]]);
                spaces[0].numsLeft = [num];
            }
        });
    });

    //go through each column
    colGrid.forEach(column => {
        //filter out the numbers left to be filled in the column
        const unfilledNums = [1,2,3,4,5,6,7,8,9];
        column.forEach(space => {if (space.numsLeft.length == 1){
            unfilledNums.splice(unfilledNums.indexOf(space.numsLeft[0]), 1);
        }});

        //check each unfilled number and see if it only appears in one unfilled space's numsLeft list
        unfilledNums.forEach(num => {
            const spaces: Space[] = []; //spaces that include the number as possible value
            column.forEach(space => {if (space.numsLeft.includes(num)){spaces.push(space);}});
            if (spaces.length == 1){ //if only one space in col has this num as a possible value, fill it in
                filledSpaces.push([spaces[0].numsLeft.length - 1, spaces[0]]);
                spaces[0].numsLeft = [num];
            }
        });
    });

    return filledSpaces;
}