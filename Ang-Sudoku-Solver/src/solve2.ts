import Space from './classes/Space';

export default function prepareSolve(rows: number[][], columns: number[][]){

    const spaceTable: Space[][] = [[],[],[],[],[],[],[],[],[]];
    const boxValues: number[][] = [[],[],[],[],[],[],[],[],[]];

    //eliminate box values that are already filled
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (rows[i][j] != 0){
                boxValues[Space.getBoxIndex(i, j)].push(rows[i][j]); //add values to the box for lookup
            }
        }
    }

    //create spaces that have empty values and put them in box list
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (rows[i][j] == 0){
                const space = new Space(i, j);
                //filter out numbers initially in numsLeft that are in space row, column and box.
                //then remove them from numsLeft 
                space.numsLeft.filter(num => rows[i].includes(num) || columns[j].includes(num)
                    || boxValues[space.box].includes(num)).forEach(num => space.removeNum(num));
                spaceTable[space.numsLeft.length - 1].push(space); //add space to spaceTable
            }
        }
    }

    solve(rows, columns, spaceTable);
    
    console.log(rows);
}


function solve(rows: number[][], columns: number[][], spaceTable: Space[][]){

    while (spaceTable[0].length != 0) { //loop until no spaces with one possible value left remain

        //pop the last element, update the grids
        const space = spaceTable[0].pop();
        const num = space?.numsLeft[0]!;
        rows[space?.row!][space?.col!] = num;
        columns[space?.col!][space?.row!] = num;

        //update the rest of the remaining spaces in the spaceTable, start at 2nd row
        for (let i = 1; i < 9; i++){
            //list that has spaces that lose that num as a possible value
            const updatedSpaces = spaceTable[i].filter(otherSpace => otherSpace.row == space?.row 
                || otherSpace.col == space?.col || otherSpace.box == space?.box);
            updatedSpaces.reverse().forEach(space => { //for each element:
                space.removeNum(num); //remove the number from its possible value list
                if (space.numsLeft.length == i){
                    spaceTable[i - 1].push(space); //move the space to the list above it
                    spaceTable[i].splice(spaceTable[i].findIndex(otherSpace => otherSpace === space), 1);
                }
            });
        }

    }

    //once we have no spaces left that only have one possible value, check if puzzle is solved
    if (spaceTable.filter(list => list.length > 0).length > 0) {
        //go through each space in the table
        for (let i = 1; i < spaceTable.length; i++){
            for (let j = 0; j < spaceTable[i].length; j++){
                //at every space, pick every possible value left and plug value into space to find solution
                spaceTable[i][j].numsLeft.forEach(value => {
                    //duplicate grids and table to recursively call solve() on copies
                    const dupRowGrid = duplicateGrid(rows);
                    const dupColGrid = duplicateGrid(columns);
                    const dupSpaceTable = duplicateTable(spaceTable, i, j, value);
                    solve(dupRowGrid, dupColGrid, dupSpaceTable);
                    //check if we have no spaces left (puzzle solved)
                    if (dupSpaceTable.filter(list => list.length > 0).length == 0){
                        //reassign main grids and tables to their respective copy's data and return
                        rows = dupRowGrid;
                        columns = dupColGrid;
                        spaceTable = dupSpaceTable;
                        return;
                    }
                });
            }
        }
        
    }
    //return if we wither solved the puzzle or we couldn't find a solution in a call
    return;
}

function duplicateGrid(grid: number[][]){

    const newGrid: number[][] = [];
    grid.forEach(row => newGrid.push(row.slice(0, 9)));
    return newGrid;
}

function duplicateTable(spaceTable: Space[][], row: number, column: number, value: number) {
    const newTable: Space[][] = [[],[],[],[],[],[],[],[],[]];
    const newSpace = new Space(row, column);
    newSpace.numsLeft = [value];
    newTable[0].push(newSpace);
    for (let i = 1; i < 9; i++){
        for (let j = 0; j < spaceTable[i].length; j++){
            if (i != row || j != column){
                const space = new Space(spaceTable[i][j].row, spaceTable[i][j].col);
                space.numsLeft = spaceTable[i][j].numsLeft.slice(0, spaceTable[i][j].numsLeft.length);
                newTable[i].push(space);
            }
        }
    }

    return newTable;
}