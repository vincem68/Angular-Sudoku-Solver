import Space from "./classes/Space";

export default function solve(rowGrid: Space[][], colGrid: Space[][], boxGrid: Space[][], numsLeftGrid: Space[][]) {

    while (1) {
        //if numsLeftGrid is completely empty, no more spaces left to fill
        if (numsLeftGrid.filter(list => list.length > 0).length == 0){
            break;
        }
        //look for any spaces that only have one value left, update adjacent spaces
        if (numsLeftGrid[0].length > 0) {

            const removedSpace = numsLeftGrid[0].pop();
            const num = removedSpace?.numsLeft[0]!;

            //update the rest of the remaining spaces in the spaceTable, start at 2nd row
            for (let i = 1; i < 9; i++){
                //list that has spaces that lose that num as a possible value
                const updatedSpaces = numsLeftGrid[i].filter(space => space.row == removedSpace?.row 
                    || space.col == removedSpace?.col || space.box == removedSpace?.box);
                updatedSpaces.reverse().forEach(space => { //for each element:
                    space.removeNum(num); //remove the number from its possible value list
                    if (space.numsLeft.length == i){
                        numsLeftGrid[i - 1].push(space); //move the space to the list above it
                        numsLeftGrid[i].splice(numsLeftGrid[i].findIndex(otherSpace => otherSpace === space), 1);
                    }
                });
            }
            
        } else { //if no spaces remain with only 1 value remaining, narrow down spaces
            const filledSpaces = narrowDownSpaces(rowGrid, colGrid, boxGrid);
            filledSpaces.forEach(spaceInfo => {
                //remove Space from its initial position in numsLeftGrid and move it to the top
                numsLeftGrid[spaceInfo[0]]
                    .splice(numsLeftGrid[spaceInfo[0]].findIndex(otherSpace => otherSpace === spaceInfo[1]), 1);
                numsLeftGrid[0].push(spaceInfo[1]); //put to top
            });
        }
    }
}

/**
 * This function is used whenever we don't have any spaces that only have 1 possible value remaining.
 * The goal of this function is to check every box, row, and column if there's only 1 space within
 * that box, row or column that has a specific number left to be filled
 * @param boxGrid 
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