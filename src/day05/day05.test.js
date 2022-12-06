const chunk = function (array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        result.push(chunk);
    }
    return result;
}

const parseCrates = function (crates) {
    const cratesHor =
        crates
            .map(crateHor => {
                return chunk(crateHor, 4)
                    .map(crate => crate.trim())
            });

    const result = [];
    for(let i = cratesHor.length - 1; i >= 0; i--) {
        for(const [stackIndex, crate] of cratesHor[i].entries()) {
            if(!result[stackIndex]) {
                result[stackIndex] = [];
            }
            if(crate !== "") {
                result[stackIndex].push(crate);
            }
        }
    }
    return result;
}

const parseCommands = function(commands) {
    return commands
        .map(command => {
            const commandSplit = command.split(" ");
            return [+commandSplit[1],
            +commandSplit[3] - 1,
            +commandSplit[5] - 1]
        });
}

const parseInput = function (input) {
    const lines = input.split('\n');
    const splitIndex = lines.findIndex(el => el === "");
    const crates = lines.slice(0, splitIndex - 1);
    const commands = lines.slice(splitIndex + 1);

    return [parseCrates(crates),
        parseCommands(commands)];
}

const takeTopCrates = function(crates) {
    return crates
        .map(crateStack => crateStack.at(-1))
        .map(str => str.replace("[", ""))
        .map(str => str.replace("]", ""))
        .join("")
}
const moveAllCratesOneByOne = function(crates, commands){
    for(const [numberToMove, from, to] of commands) {
        for(let move = 0; move < numberToMove; move++) {
            const crate = crates[from].pop();
            if(crate) {
                crates[to].push(crate);
            }
        }
    }

    return takeTopCrates(crates);
}

const moveAllCratesStacked = function(crates, commands){
    for(const [numberToMove, from, to] of commands) {
        const cratesToMove = crates[from].slice(-numberToMove);
        crates[from].splice(crates[from].length - numberToMove, numberToMove);
        cratesToMove.forEach(c => crates[to].push(c));
    }

    return takeTopCrates(crates);
}

test('can compute crates at top by moving one by one for test input', () => {
    const [crates, commands] = parseInput(testInput);
    const resultAtTop = moveAllCratesOneByOne(crates, commands);
    expect(resultAtTop).toEqual("CMZ");
});

test('can compute crates at top by moving stacked for test input', () => {
    const [crates, commands] = parseInput(testInput);
    const resultAtTop = moveAllCratesStacked(crates, commands);
    expect(resultAtTop).toEqual("MCD");
});

test('can compute crates at top by moving one by one for puzzle input', () => {
    const [crates, commands] = parseInput(puzzleInput);
    const resultAtTop = moveAllCratesOneByOne(crates, commands);
    expect(resultAtTop).toEqual("RNZLFZSJH");
});

test('can compute crates at top by moving stacked for puzzle input', () => {
    const [crates, commands] = parseInput(puzzleInput);
    const resultAtTop = moveAllCratesStacked(crates, commands);
    expect(resultAtTop).toEqual("CNSFCGJSM");
});


const testInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const puzzleInput = `[S]                 [T] [Q]        
[L]             [B] [M] [P]     [T]
[F]     [S]     [Z] [N] [S]     [R]
[Z] [R] [N]     [R] [D] [F]     [V]
[D] [Z] [H] [J] [W] [G] [W]     [G]
[B] [M] [C] [F] [H] [Z] [N] [R] [L]
[R] [B] [L] [C] [G] [J] [L] [Z] [C]
[H] [T] [Z] [S] [P] [V] [G] [M] [M]
 1   2   3   4   5   6   7   8   9 

move 6 from 1 to 7
move 2 from 2 to 4
move 2 from 7 to 4
move 6 from 4 to 3
move 1 from 5 to 1
move 3 from 8 to 3
move 15 from 3 to 4
move 6 from 5 to 9
move 14 from 4 to 2
move 3 from 2 to 7
move 1 from 2 to 7
move 9 from 9 to 1
move 3 from 2 to 1
move 7 from 6 to 7
move 1 from 6 to 8
move 2 from 9 to 1
move 9 from 2 to 3
move 8 from 3 to 9
move 1 from 1 to 4
move 1 from 8 to 6
move 1 from 6 to 2
move 5 from 9 to 8
move 2 from 9 to 1
move 1 from 4 to 2
move 17 from 1 to 9
move 1 from 3 to 1
move 3 from 2 to 3
move 2 from 4 to 5
move 12 from 7 to 3
move 16 from 9 to 2
move 5 from 7 to 5
move 2 from 1 to 2
move 1 from 3 to 6
move 1 from 4 to 6
move 1 from 7 to 3
move 1 from 6 to 3
move 7 from 3 to 4
move 5 from 8 to 3
move 1 from 6 to 7
move 7 from 3 to 4
move 6 from 3 to 1
move 2 from 4 to 8
move 1 from 5 to 2
move 10 from 4 to 5
move 3 from 5 to 2
move 2 from 8 to 9
move 5 from 2 to 8
move 1 from 3 to 5
move 2 from 5 to 8
move 12 from 5 to 7
move 1 from 4 to 2
move 5 from 9 to 4
move 1 from 2 to 5
move 6 from 1 to 3
move 6 from 3 to 5
move 10 from 7 to 4
move 2 from 7 to 3
move 4 from 7 to 6
move 1 from 9 to 5
move 12 from 2 to 1
move 1 from 8 to 7
move 3 from 7 to 4
move 4 from 4 to 8
move 7 from 5 to 3
move 1 from 2 to 4
move 10 from 1 to 5
move 2 from 1 to 2
move 4 from 6 to 7
move 8 from 8 to 3
move 5 from 4 to 9
move 12 from 3 to 8
move 4 from 3 to 8
move 2 from 9 to 2
move 3 from 5 to 4
move 1 from 3 to 5
move 1 from 7 to 6
move 14 from 4 to 6
move 6 from 5 to 9
move 8 from 2 to 8
move 3 from 5 to 7
move 21 from 8 to 4
move 16 from 4 to 9
move 8 from 6 to 2
move 4 from 6 to 1
move 1 from 4 to 6
move 2 from 4 to 8
move 3 from 1 to 8
move 2 from 4 to 6
move 1 from 6 to 2
move 3 from 8 to 4
move 2 from 2 to 5
move 2 from 5 to 7
move 1 from 8 to 9
move 1 from 4 to 9
move 1 from 1 to 6
move 3 from 6 to 3
move 3 from 2 to 3
move 1 from 4 to 6
move 3 from 6 to 7
move 10 from 9 to 7
move 1 from 4 to 7
move 6 from 8 to 3
move 1 from 6 to 8
move 2 from 2 to 5
move 1 from 2 to 1
move 1 from 8 to 9
move 1 from 2 to 8
move 1 from 1 to 9
move 7 from 9 to 1
move 1 from 8 to 5
move 7 from 1 to 7
move 3 from 5 to 8
move 3 from 7 to 2
move 1 from 8 to 4
move 1 from 2 to 4
move 2 from 4 to 6
move 5 from 3 to 1
move 9 from 7 to 2
move 6 from 3 to 8
move 8 from 2 to 7
move 2 from 6 to 4
move 2 from 1 to 7
move 2 from 1 to 4
move 24 from 7 to 4
move 4 from 8 to 9
move 2 from 7 to 5
move 1 from 5 to 2
move 1 from 3 to 8
move 4 from 2 to 8
move 13 from 9 to 2
move 2 from 8 to 6
move 3 from 9 to 6
move 26 from 4 to 2
move 1 from 5 to 7
move 2 from 6 to 2
move 2 from 4 to 1
move 7 from 2 to 1
move 15 from 2 to 6
move 8 from 2 to 8
move 4 from 6 to 8
move 9 from 2 to 9
move 13 from 6 to 7
move 6 from 1 to 9
move 2 from 2 to 4
move 4 from 1 to 6
move 3 from 8 to 3
move 1 from 4 to 9
move 2 from 6 to 7
move 1 from 4 to 3
move 3 from 3 to 2
move 14 from 7 to 4
move 5 from 9 to 5
move 9 from 8 to 5
move 7 from 9 to 6
move 2 from 5 to 6
move 2 from 9 to 2
move 10 from 5 to 1
move 1 from 3 to 1
move 2 from 8 to 1
move 1 from 9 to 2
move 1 from 7 to 5
move 4 from 2 to 1
move 1 from 9 to 8
move 3 from 4 to 1
move 1 from 8 to 6
move 12 from 1 to 5
move 1 from 1 to 6
move 1 from 7 to 5
move 4 from 6 to 9
move 2 from 2 to 4
move 1 from 9 to 6
move 1 from 1 to 5
move 2 from 9 to 7
move 10 from 6 to 5
move 1 from 6 to 7
move 20 from 5 to 1
move 1 from 7 to 9
move 2 from 9 to 1
move 3 from 5 to 1
move 2 from 8 to 4
move 2 from 8 to 7
move 1 from 5 to 9
move 1 from 8 to 4
move 22 from 1 to 7
move 5 from 4 to 8
move 1 from 5 to 9
move 19 from 7 to 4
move 2 from 9 to 1
move 1 from 5 to 9
move 10 from 1 to 8
move 1 from 9 to 1
move 1 from 8 to 3
move 8 from 4 to 7
move 1 from 5 to 6
move 3 from 4 to 5
move 1 from 5 to 9
move 11 from 7 to 4
move 4 from 4 to 9
move 1 from 6 to 2
move 1 from 3 to 9
move 5 from 9 to 4
move 5 from 7 to 9
move 23 from 4 to 2
move 17 from 2 to 7
move 2 from 2 to 8
move 4 from 4 to 7
move 1 from 4 to 5
move 2 from 5 to 2
move 5 from 8 to 9
move 5 from 2 to 7
move 9 from 7 to 5
move 11 from 9 to 2
move 1 from 4 to 3
move 5 from 8 to 7
move 3 from 8 to 5
move 2 from 1 to 3
move 2 from 3 to 9
move 1 from 5 to 8
move 5 from 7 to 5
move 15 from 5 to 4
move 2 from 8 to 1
move 2 from 5 to 1
move 4 from 4 to 1
move 1 from 8 to 7
move 8 from 2 to 1
move 4 from 2 to 8
move 2 from 7 to 4
move 5 from 8 to 6
move 5 from 7 to 9
move 4 from 6 to 5
move 7 from 4 to 8
move 1 from 6 to 1
move 1 from 3 to 1
move 2 from 5 to 1
move 7 from 1 to 5
move 5 from 1 to 3
move 4 from 7 to 9
move 4 from 3 to 9
move 2 from 9 to 7
move 6 from 9 to 2
move 1 from 4 to 1
move 1 from 3 to 5
move 1 from 2 to 5
move 5 from 9 to 4
move 4 from 4 to 6
move 1 from 8 to 9
move 8 from 4 to 3
move 7 from 7 to 3
move 5 from 1 to 3
move 11 from 5 to 9
move 1 from 7 to 6
move 2 from 3 to 5
move 1 from 3 to 1
move 3 from 6 to 2
move 2 from 5 to 1
move 2 from 1 to 2
move 3 from 1 to 5
move 5 from 9 to 2
move 2 from 6 to 8
move 2 from 3 to 8
move 4 from 9 to 7
move 3 from 5 to 2
move 2 from 1 to 8
move 1 from 9 to 8
move 1 from 9 to 2
move 4 from 7 to 9
move 11 from 8 to 7
move 1 from 8 to 2
move 6 from 9 to 7
move 3 from 7 to 1
move 13 from 2 to 7
move 24 from 7 to 1
move 2 from 2 to 6
move 1 from 8 to 3
move 1 from 9 to 3
move 5 from 2 to 4
move 1 from 2 to 5
move 1 from 6 to 2
move 1 from 6 to 3
move 1 from 2 to 4
move 3 from 7 to 3
move 2 from 1 to 7
move 2 from 3 to 8
move 2 from 7 to 8
move 9 from 3 to 2
move 3 from 4 to 8
move 1 from 5 to 1
move 9 from 2 to 1
move 3 from 4 to 9
move 1 from 7 to 8
move 6 from 3 to 9
move 2 from 1 to 5
move 15 from 1 to 3
move 13 from 3 to 9
move 11 from 1 to 4
move 5 from 4 to 1
move 6 from 3 to 6
move 4 from 4 to 8
move 6 from 1 to 4
move 1 from 5 to 2
move 1 from 2 to 1
move 3 from 4 to 2
move 2 from 8 to 5
move 2 from 4 to 2
move 9 from 9 to 3
move 9 from 3 to 5
move 2 from 9 to 4
move 5 from 2 to 6
move 1 from 1 to 8
move 1 from 4 to 1
move 10 from 9 to 2
move 9 from 2 to 4
move 10 from 4 to 1
move 3 from 1 to 3
move 4 from 1 to 2
move 5 from 2 to 4
move 2 from 5 to 2
move 4 from 1 to 7
move 10 from 5 to 4
move 2 from 2 to 4
move 1 from 9 to 2
move 2 from 3 to 5
move 1 from 3 to 5
move 3 from 6 to 7
move 8 from 4 to 9
move 6 from 6 to 1
move 4 from 9 to 5
move 2 from 9 to 1
move 1 from 2 to 6
move 6 from 5 to 2
move 3 from 7 to 9
move 4 from 8 to 2
move 1 from 7 to 9
move 1 from 5 to 3
move 2 from 7 to 4
move 1 from 7 to 1
move 14 from 1 to 9
move 1 from 1 to 9
move 1 from 3 to 8
move 3 from 2 to 5
move 2 from 4 to 2
move 6 from 8 to 1
move 1 from 2 to 1
move 5 from 1 to 9
move 1 from 1 to 7
move 2 from 8 to 5
move 1 from 5 to 4
move 1 from 6 to 1
move 8 from 2 to 7
move 2 from 6 to 1
move 9 from 9 to 5
move 11 from 4 to 8
move 4 from 7 to 4
move 6 from 4 to 6
move 1 from 7 to 4
move 6 from 6 to 7
move 1 from 5 to 9
move 6 from 8 to 9
move 8 from 9 to 5
move 1 from 4 to 5
move 15 from 9 to 3
move 3 from 1 to 4
move 6 from 7 to 2
move 3 from 4 to 9
move 2 from 7 to 3
move 1 from 7 to 3
move 1 from 7 to 2
move 2 from 8 to 1
move 3 from 8 to 5
move 2 from 1 to 7
move 8 from 3 to 6
move 3 from 6 to 5
move 1 from 6 to 1
move 10 from 5 to 7
move 6 from 5 to 4
move 4 from 2 to 4
move 6 from 5 to 1
move 6 from 1 to 8
move 2 from 9 to 2
move 2 from 9 to 7
move 6 from 3 to 7
move 1 from 3 to 5
move 1 from 1 to 9
move 2 from 8 to 1
move 2 from 5 to 4
move 3 from 3 to 7
move 10 from 4 to 6
move 1 from 9 to 7
move 12 from 7 to 3
move 12 from 3 to 8
move 2 from 1 to 5
move 1 from 1 to 3
move 13 from 8 to 1
move 7 from 7 to 1
move 13 from 6 to 9
move 1 from 7 to 4
move 6 from 5 to 3
move 3 from 4 to 3
move 6 from 3 to 1
move 10 from 9 to 4
move 2 from 7 to 6
move 8 from 1 to 9
move 3 from 2 to 9
move 1 from 3 to 5
move 1 from 3 to 5
move 1 from 1 to 4
move 6 from 9 to 3
move 2 from 6 to 7
move 4 from 9 to 5
move 4 from 1 to 6
move 1 from 2 to 4
move 6 from 1 to 4
move 3 from 9 to 3
move 3 from 6 to 8
move 3 from 8 to 7
move 5 from 5 to 1
move 1 from 3 to 9
move 1 from 9 to 5
move 1 from 3 to 2
move 2 from 5 to 1
move 1 from 6 to 9
move 1 from 6 to 3
move 2 from 9 to 7
move 2 from 8 to 1
move 1 from 3 to 2
move 1 from 2 to 5
move 1 from 7 to 1
move 7 from 7 to 9
move 12 from 1 to 9
move 1 from 5 to 2
move 1 from 7 to 1
move 13 from 4 to 7
move 1 from 9 to 4
move 5 from 7 to 3
move 4 from 9 to 1
move 8 from 7 to 9
move 3 from 2 to 3
move 4 from 3 to 7
move 5 from 4 to 6
move 3 from 9 to 4
move 10 from 1 to 5
move 3 from 4 to 7
move 16 from 9 to 2
move 3 from 9 to 2
move 6 from 5 to 3
move 4 from 6 to 2
move 1 from 4 to 6
move 2 from 6 to 8
move 1 from 5 to 2
move 1 from 5 to 8
move 7 from 7 to 2
move 16 from 2 to 1
move 1 from 5 to 1
move 10 from 2 to 8
move 14 from 8 to 5
move 2 from 2 to 6
move 1 from 2 to 5
move 2 from 2 to 1
move 8 from 1 to 7
move 4 from 1 to 7
move 2 from 1 to 7
move 5 from 3 to 2
move 1 from 1 to 6
move 2 from 2 to 5
move 4 from 1 to 7
move 1 from 2 to 8
move 1 from 2 to 8
move 3 from 6 to 7
move 10 from 7 to 5
move 1 from 2 to 8
move 27 from 5 to 9
move 1 from 5 to 6
move 1 from 6 to 4
move 1 from 4 to 3
move 3 from 3 to 7
move 4 from 3 to 6
move 2 from 6 to 4
move 3 from 8 to 1
move 2 from 6 to 1
move 12 from 7 to 8
move 2 from 3 to 9
move 1 from 9 to 2
move 1 from 2 to 8
move 2 from 1 to 2
move 6 from 3 to 8
move 1 from 7 to 4
move 15 from 9 to 5
move 7 from 9 to 4
move 1 from 2 to 1
move 16 from 8 to 2
move 8 from 5 to 2
move 24 from 2 to 9
move 3 from 1 to 2
move 24 from 9 to 1
move 5 from 5 to 9
move 3 from 4 to 1
move 1 from 7 to 6
move 1 from 6 to 3
move 1 from 3 to 2
move 3 from 2 to 3
move 1 from 5 to 6
move 1 from 2 to 7`
