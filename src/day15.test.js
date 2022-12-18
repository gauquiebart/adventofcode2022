const createPoint = function (x, y) {
    return [x, y];
}

const x = function (point) {
    return point[0];
}

const y = function (point) {
    return point[1];
}

const isEqualPoint = function(p1, p2) {
    return x(p1) === x(p2) && y(p1) === y(p2);
}

const filterRow = function(row) {
    return (p) => y(p) === row;
}

const manDist = function (p1, p2) {
    return Math.abs(x(p1) - x(p2))
        + Math.abs(y(p1) - y(p2));
}

const calculateCoverage = function (s, b) {
    const md = manDist(s, b);
    const scanningPositions = [];
    let columns = 1;
    let columnsDelta = 2;
    for (let row = y(s) - md; row <= y(s) + md; row++) {
        const startColumn = x(s) - Math.floor(columns / 2);
        const endColumn = startColumn + columns;
        for (let column = startColumn; column < endColumn; column++) {
            scanningPositions.push(createPoint(column, row));
        }
        columns = columns + columnsDelta;
        if ((row + 1) === y(s)) {
            columnsDelta = columnsDelta * -1;
        }
    }

    return scanningPositions;
}

const calculateOverallCoverageExcludingBeaconsItself = function(sensors) {
    const beaconPositions = sensors
        .map(s => pointOfBeacon(closestBeaconOfSensor(s)));
    return sensors
        .flatMap(s => rhombusOfSensor(s))
        .reduce((acc, val) => {
            if(acc.find(el => isEqualPoint(el, val)) === undefined) {
                acc.push(val);
            }
            return acc;
        }, [])
        .filter(p => beaconPositions.find(el => isEqualPoint(el, p)) === undefined);
}

const createSensor = function (x, y, closestBeacon) {
    const origin = createPoint(x, y);
    return ['sensor', origin, closestBeacon, calculateCoverage(origin, pointOfBeacon(closestBeacon))];
}

const pointOfSensor = function (sensor) {
    return sensor[1];
}

const closestBeaconOfSensor = function (sensor) {
    return sensor[2];
}

const rhombusOfSensor = function (sensor) {
    return sensor[3];
}

const createBeacon = function (x, y) {
    return ['beacon', createPoint(x, y)];
}

const pointOfBeacon = function (beacon) {
    return beacon[1];
}

const parseInput = function (input) {
    return input
        .split('\n')
        .map(l => {
            const [sensor, beacon] = l.split(":");
            const sensorParsed = sensor.match(/Sensor at x=(-?)(\d.*), y=(-?)(\d.*)/i);
            const beaconParsed = beacon.match(/closest beacon is at x=(-?)(\d.*), y=(-?)(\d.*)/i);
            const closestBeacon = createBeacon(+(beaconParsed[1] + beaconParsed[2]), +(beaconParsed[3] + beaconParsed[4]));
            return createSensor(+(sensorParsed[1] + sensorParsed[2]), +(sensorParsed[3] + sensorParsed[4]), closestBeacon);
        });
}

test('can calculate Manhattan distance', () => {
    expect(manDist(createPoint(8, 7), createPoint(2, 10))).toEqual(9);
});

test('can calculate coverage rhombus', () => {
    expect(rhombusOfSensor(createSensor(8, 7, createBeacon(2, 10)))).toEqual(
        [
            [8, -2],
            [7, -1], [8, -1], [9, -1],
            [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],
            [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1],
            [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2],
            [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3],
            [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4], [14, 4],
            [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5], [13, 5], [14, 5], [15, 5],
            [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6], [15, 6], [16, 6],
            [-1, 7], [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7], [14, 7], [15, 7], [16, 7], [17, 7],
            [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [15, 8], [16, 8],
            [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 9], [14, 9], [15, 9],
            [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10], [11, 10], [12, 10], [13, 10], [14, 10],
            [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11], [10, 11], [11, 11], [12, 11], [13, 11],
            [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12], [11, 12], [12, 12],
            [5, 13], [6, 13], [7, 13], [8, 13], [9, 13], [10, 13], [11, 13],
            [6, 14], [7, 14], [8, 14], [9, 14], [10, 14],
            [7, 15], [8, 15], [9, 15],
            [8, 16]]
    );
    expect(rhombusOfSensor(createSensor(8, 7, createBeacon(8, 7)))).toEqual([[8, 7]]);
    expect(rhombusOfSensor(createSensor(8, 7, createBeacon(8, 8)))).toEqual([
        [8, 6],
        [7, 7], [8, 7], [9, 7],
        [8, 8]
    ]);
});

test('can calculate coverage from all sensors input', () => {
    expect(calculateOverallCoverageExcludingBeaconsItself(parseInput(testInput)).filter(filterRow(10)).length).toEqual(26);
});


testInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

