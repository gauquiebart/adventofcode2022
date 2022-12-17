const createPoint = function (x, y) {
    return ['point', x, y];
}

const x = function (point) {
    return point[1];
}

const y = function (point) {
    return point[2];
}

const createSensor = function (x, y, closestBeacon) {
    return ['sensor', createPoint(x, y), closestBeacon];
}

const pointOfSensor = function (sensor) {
    return sensor[1];
}

const closestBeaconOfSensor = function (sensor) {
    return sensor[2];
}

const createBeacon = function (x, y) {
    return ['beacon', createPoint(x, y)];
}

const pointOfBeacon = function (beacon) {
    return beacon[1];
}

const manDist = function (p1, p2) {
    return Math.abs(x(p1) - x(p2))
        + Math.abs(y(p1) - y(p2));
}

const manDistSensorToClosestBeacon = function (sensor) {
    const sensorPoint = pointOfSensor(sensor);
    const beaconPoint = pointOfBeacon(closestBeaconOfSensor(sensor));
    return manDist(sensorPoint, beaconPoint);
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

test('can parse input', () => {
    expect(parseInput(testInput)).toEqual(1);
});

test('can calculate Manhattan distance', () => {
    expect(manDistSensorToClosestBeacon(createSensor(8, 7, createBeacon(2, 10)))).toEqual(9);
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

