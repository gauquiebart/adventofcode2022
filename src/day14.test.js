const ROCK = '#';
const AIR = '.';
const SOURCE = '+';
const SAND = 'o';

const visualizeCave = function (cave) {
    const str = "CAVE:\n" + cave
        .reduce((accumulator, currentValue) => {
            return accumulator + currentValue.join("") + "\n";
        }, "");
    console.log(str);
    return cave;
};

const createCave = function (segments) {
    const [lowestX, highestX] =
        segments.reduce((accumulator, currentValue) =>
                [Math.min(accumulator[0], currentValue[0][0], currentValue[1][0]),
                    Math.max(accumulator[1], currentValue[0][0], currentValue[1][0])],
            [Number.MAX_VALUE, Number.MIN_VALUE]);

    const highestY =
        segments.reduce((accumulator, currentValue) =>
            Math.max(accumulator, currentValue[0][1], currentValue[1][1]), Number.MIN_VALUE);

    const grid = new Array(highestY + 1);
    for (let y = 0; y <= highestY; y++) {
        grid[y] = new Array(highestX - lowestX + 1);
        grid[y].fill(AIR);
    }

    segments
        .forEach(segment => {
            console.log(segment);
            let [[x1, y1], [x2, y2]] = segment;
            x1 = x1 - lowestX;
            x2 = x2 - lowestX;
            if (x1 === x2) {
                if (y2 >= y1) {
                    for (let y = y1; y < y2; y++) {
                        grid[y][x1] = ROCK;
                    }
                }
                if (y2 < y1) {
                    for (let y = y1; y > y2; y--) {
                        grid[y][x1] = ROCK;
                    }
                }
            }
            if (y1 === y2) {
                if (x2 >= x1) {
                    for (let x = x1; x < x2; x++) {
                        grid[y1][x] = ROCK;
                    }
                }
                if (x2 < x1) {
                    console.log(`x2 < x1 ${x2} - ${x1}`);
                    for (let x = x1; x >= x2; x--) {
                        grid[y1][x] = ROCK;
                    }
                }
            }

        });

    grid[0][500 - lowestX] = SOURCE;

    return grid;
};

const createSegments = function (array) {
    return array.reduce(function (result, value, index, array) {
        if (index > 0)
            result.push([array[index - 1], value]);
        return result;
    }, []);
};

const parseSegments = function (input) {
    const paths = input.split('\n')
        .flatMap(path => {
            const p = path.split('->').map(xycoord => xycoord.trim().split(",").flatMap(coord => +coord));
            return createSegments(p);
        });
    return paths;
};

test(`simulate sand for test input`, () => {
    expect(visualizeCave(createCave(parseSegments(testInput)))).toEqual(1);
});

const testInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`
