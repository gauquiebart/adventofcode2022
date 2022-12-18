class ValueObjectFactory {

    static _valueObjects = new Map();

    static asValueObject(val, key1, key2) {
        let cachedValueForKey1 = this._valueObjects.get(key1);
        if (cachedValueForKey1 === undefined) {
            cachedValueForKey1 = new Map();
            this._valueObjects.set(key1, cachedValueForKey1);
        }

        let cachedValue = cachedValueForKey1.get(key2);
        if (cachedValue !== undefined) {
            return cachedValue
        }
        cachedValueForKey1.set(key2, val);
        return val;
    }

}

const createPointValueObject = function (x, y) {
    return ValueObjectFactory.asValueObject([x, y], x, y);
}

const createPoint = function (x, y) {
    return [x, y];
}

const x = function (point) {
    return point[0];
}

const y = function (point) {
    return point[1];
}

const isEqualPoint = function (p1, p2) {
    return x(p1) === x(p2) && y(p1) === y(p2);
}

const filterRow = function (row) {
    return (p) => y(p) === row;
}

const manDist = function (p1, p2) {
    return Math.abs(x(p1) - x(p2))
        + Math.abs(y(p1) - y(p2));
}

const calculateCoverage = function (s, b) {
    const md = manDist(s, b);
    const coverage = [];
    let columns = 1;
    let columnsDelta = 2;
    for (let row = y(s) - md; row <= y(s) + md; row++) {
        const startColumn = x(s) - Math.floor(columns / 2);
        const endColumn = startColumn + columns;
        for (let column = startColumn; column < endColumn; column++) {
            coverage.push(createPointValueObject(column, row));
        }
        columns = columns + columnsDelta;
        if ((row + 1) === y(s)) {
            columnsDelta = columnsDelta * -1;
        }
    }

    return coverage;
}

const calculateOverallCoverageExcludingBeaconsItself = function (sensors) {
    const beaconPositions = new Set(sensors
        .map(s => pointOfBeacon(closestBeaconOfSensor(s))));
    const fullCoverage = new Set(sensors
        .flatMap(s => rhombusOfSensor(s)));
    return new Set(
        Array.from(fullCoverage).filter(x => !beaconPositions.has(x))
    )
}

const calculateCoverageFromAllSensorsForRow = function (sensors, row) {
    const minX = sensors.reduce((acc, sensor) => Math.min(acc, x(pointOfSensor(sensor)) - manDistOfSensor(sensor)), Number.MAX_VALUE);
    const maxX = sensors.reduce((acc, sensor) => Math.max(acc, x(pointOfSensor(sensor)) + manDistOfSensor(sensor)), Number.MIN_VALUE);

    const xMatches = new Array(maxX - minX);

    for(let sensor of sensors) {
        const [sx, sy] = pointOfSensor(sensor);
        const [bsx, bsy] = pointOfBeacon(closestBeaconOfSensor(sensor));
        const md = manDistOfSensor(sensor);
        const yDiff = Math.abs(sy - row);

        for (let column = (sx - md); column <= (sx + md); column++) {
            const manDistSensorPointToP = Math.abs(sx - column) + yDiff;
            if(manDistSensorPointToP <= md) {
                if(bsx === column && bsy === row) {
                    continue;
                }
                xMatches[column - minX] = 1;
            }
        }
    }

    return xMatches
        .reduce((acc, value) => acc + (value != null ? 1 : 0), 0);
}


const createSensor = function (x, y, closestBeacon) {
    const origin = createPointValueObject(x, y);
    return ['sensor', origin, closestBeacon, calculateCoverage(origin, pointOfBeacon(closestBeacon))];
}

const createSensorNoCoverage = function (x, y, closestBeacon) {
    const sensorOrigin = createPointValueObject(x, y);
    const beaconPoint = pointOfBeacon(closestBeacon);
    return ['sensor', sensorOrigin, closestBeacon, manDist(sensorOrigin, beaconPoint)];
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

const manDistOfSensor = function (sensor) {
    return sensor[3];
}

const createBeacon = function (x, y) {
    return ['beacon', createPointValueObject(x, y)];
}

const pointOfBeacon = function (beacon) {
    return beacon[1];
}

const parseInput = function (input, sensorFn) {
    return input
        .split('\n')
        .map(l => {
            const [sensor, beacon] = l.split(":");
            const sensorParsed = sensor.match(/Sensor at x=(-?)(\d.*), y=(-?)(\d.*)/i);
            const beaconParsed = beacon.match(/closest beacon is at x=(-?)(\d.*), y=(-?)(\d.*)/i);
            const closestBeacon = createBeacon(+(beaconParsed[1] + beaconParsed[2]), +(beaconParsed[3] + beaconParsed[4]));
            return sensorFn(+(sensorParsed[1] + sensorParsed[2]), +(sensorParsed[3] + sensorParsed[4]), closestBeacon);
        });
}

test('can calculate Manhattan distance', () => {
    expect(manDist(createPointValueObject(8, 7), createPointValueObject(2, 10))).toEqual(9);
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

test('can calculate coverage from all sensors for test input', () => {
    expect(Array.from(calculateOverallCoverageExcludingBeaconsItself(parseInput(testInput, createSensor))).filter(filterRow(10)).length).toEqual(26);
});

test('can calculate coverage from all sensors for a specific row for test input', () => {
    expect(calculateCoverageFromAllSensorsForRow(parseInput(testInput, createSensorNoCoverage), 10)).toEqual(26);
});

test('can calculate coverage from all sensors for puzzle input', () => {
    //goes out of memory ... and is very unusable slow
    //expect(calculateOverallCoverageExcludingBeaconsItself(parseInput(puzzleInput)).filter(filterRow(200000)).length).toEqual(26283);
});

test('can calculate coverage from all sensors for a specific row for puzzle input', () => {
    //expect(calculateCoverageFromAllSensorsForRow(parseInput(puzzleInput, createSensorNoCoverage), 5186862).size).toEqual(26);
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

puzzleInput = `Sensor at x=3844106, y=3888618: closest beacon is at x=3225436, y=4052707
Sensor at x=1380352, y=1857923: closest beacon is at x=10411, y=2000000
Sensor at x=272, y=1998931: closest beacon is at x=10411, y=2000000
Sensor at x=2119959, y=184595: closest beacon is at x=2039500, y=-250317
Sensor at x=1675775, y=2817868: closest beacon is at x=2307516, y=3313037
Sensor at x=2628344, y=2174105: closest beacon is at x=3166783, y=2549046
Sensor at x=2919046, y=3736158: closest beacon is at x=3145593, y=4120490
Sensor at x=16, y=2009884: closest beacon is at x=10411, y=2000000
Sensor at x=2504789, y=3988246: closest beacon is at x=3145593, y=4120490
Sensor at x=2861842, y=2428768: closest beacon is at x=3166783, y=2549046
Sensor at x=3361207, y=130612: closest beacon is at x=2039500, y=-250317
Sensor at x=831856, y=591484: closest beacon is at x=-175938, y=1260620
Sensor at x=3125600, y=1745424: closest beacon is at x=3166783, y=2549046
Sensor at x=21581, y=3243480: closest beacon is at x=10411, y=2000000
Sensor at x=2757890, y=3187285: closest beacon is at x=2307516, y=3313037
Sensor at x=3849488, y=2414083: closest beacon is at x=3166783, y=2549046
Sensor at x=3862221, y=757146: closest beacon is at x=4552923, y=1057347
Sensor at x=3558604, y=2961030: closest beacon is at x=3166783, y=2549046
Sensor at x=3995832, y=1706663: closest beacon is at x=4552923, y=1057347
Sensor at x=1082213, y=3708082: closest beacon is at x=2307516, y=3313037
Sensor at x=135817, y=1427041: closest beacon is at x=-175938, y=1260620
Sensor at x=2467372, y=697908: closest beacon is at x=2039500, y=-250317
Sensor at x=3448383, y=3674287: closest beacon is at x=3225436, y=4052707`;
