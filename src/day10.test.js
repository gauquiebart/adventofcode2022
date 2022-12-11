const parseInstructions = function (input) {
    return input.split('\n')
        .flatMap(l => {
            if (l === 'noop') {
                return [l];
            } else {
                const [_, addend] = l.split(" ")
                return ['noop', ['addx', +addend]]
            }
        });
}

const addend = function (operator) {
    return operator[1];
}

const calculateSumOfSignalStrengths = function (instructions) {
    return instructions
        .reduce((accumulator, instruction, currentIndex) => {
            let [registerXDuringCycle, signalStrengthAccum] = accumulator;
            const currentIndexOneBased = currentIndex + 1;

            if (currentIndexOneBased === 20
                || (currentIndexOneBased - 20) % 40 === 0) {
                signalStrengthAccum = signalStrengthAccum + currentIndexOneBased * registerXDuringCycle;
            }

            if (instruction === 'noop') {
                return [registerXDuringCycle, signalStrengthAccum];
            } else {
                return [registerXDuringCycle + addend(instruction), signalStrengthAccum];
            }
        }, [1, 0]);
}

const createCRT = function () {
    return [
        '.'.repeat(40).split(""),
        '.'.repeat(40).split(""),
        '.'.repeat(40).split(""),
        '.'.repeat(40).split(""),
        '.'.repeat(40).split(""),
        '.'.repeat(40).split("")
    ];
}

const crtRow = function (crt, rowOneBased) {
    return crt[rowOneBased - 1];
}

const crtAndSpriteOverlap = function (crtPosition, spritePosition) {
    return crtPosition === (spritePosition - 1)
        || crtPosition === spritePosition
        || crtPosition === (spritePosition + 1);
}

const litPixel = function (crtRow, crtPosition) {
    crtRow[crtPosition] = '#';
}

const drawCrt = function (instructions) {
    const crt = createCRT();
    let spritePosition = 1;
    instructions.forEach((instruction, index) => {
        const rowIndex = Math.floor(index / 40) + 1;
        const row = crtRow(crt, rowIndex);
        const crtPosition = index % 40;

        if (crtAndSpriteOverlap(crtPosition, spritePosition)) {
            litPixel(row, crtPosition);
        }

        if (instruction !== 'noop') {
            spritePosition = spritePosition + addend(instruction);
        }

    });

    // console.log(crt
    //     .reduce((accumulator, currentValue) =>
    //             accumulator + currentValue + "\n"
    //         , ``));

    return crt;
}

test('sum of signal strengths for test input', () => {
    expect(calculateSumOfSignalStrengths(parseInstructions(testInput))[1]).toBe(13140);
});

test('sum of signal strengths for puzzle input', () => {
    expect(calculateSumOfSignalStrengths(parseInstructions(puzzleInput))[1]).toBe(15360);
});

test('draw crt for test input', () => {
    drawCrt(parseInstructions(testInput));
});

test('draw crt for puzzle input', () => {
    drawCrt(parseInstructions(puzzleInput));
});


const testInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const puzzleInput = `noop
noop
addx 5
addx 31
addx -30
addx 2
addx 7
noop
noop
addx -4
addx 5
addx 6
noop
addx -1
addx 5
addx -1
addx 5
addx 1
noop
addx 5
noop
addx -1
addx -35
addx 3
noop
addx 2
addx 3
addx -2
addx 2
noop
addx 8
addx -3
addx 5
addx -17
addx 22
addx -2
addx 2
addx 5
addx -2
addx -26
addx 31
addx 2
addx 5
addx -40
addx 30
addx -27
addx 4
addx 2
addx 3
addx -3
addx 8
noop
noop
addx 2
addx 21
addx -15
addx -2
addx 2
noop
addx 15
addx -16
addx 8
noop
addx 3
addx 5
addx -38
noop
noop
noop
addx 5
addx -5
addx 6
addx 2
addx 7
noop
noop
addx 4
addx -3
noop
noop
addx 7
addx 2
addx 2
addx -1
noop
addx 3
addx 6
noop
addx 1
noop
noop
addx -38
noop
noop
addx 7
addx 3
noop
addx 2
addx -2
addx 7
addx -2
addx 5
addx 2
addx 5
addx -4
addx 2
addx 5
addx 2
addx -21
addx 9
addx 15
noop
addx 3
addx -38
addx 7
noop
noop
addx 18
addx -17
addx 4
noop
addx 1
addx 2
addx 5
addx 3
noop
noop
addx 14
addx -9
noop
noop
addx 4
addx 1
noop
addx 4
addx 3
noop
addx -8
noop`;


