const createPosition = function (hor, vert) {
    return ['position', hor, vert];
}

const hor = function (pos) {
    return pos[1];
}

const setHor = function (pos, newHor) {
    pos[1] = newHor;
}

const vert = function (pos) {
    return pos[2];
}

const setVert = function (pos, newVert) {
    pos[2] = newVert;
}

const arePositionsTouching = function (pos, otherPos) {
    return Math.abs(hor(pos) - hor(otherPos)) <= 1
        && Math.abs(vert(pos) - vert(otherPos)) <= 1;
}

const updatePosition = function (pos, direction) {
    if (direction === 'R') {
        setHor(pos, hor(pos) + 1);
    } else if (direction === 'U') {
        setVert(pos, vert(pos) + 1);
    } else if (direction === 'L') {
        setHor(pos, hor(pos) - 1);
    } else if (direction === 'D') {
        setVert(pos, vert(pos) - 1);
    } else {
        throw new Error(`unknown direction : ${direction}`);
    }
}

const createOrigin = function () {
    return createPosition(0, 0);
}

const createHead = function () {
    return ['head', createOrigin()];
}

const createTail = function () {
    return ['tail', createOrigin(), ];
}

const position = function (headOrTail) {
    return headOrTail[1];
}

const createRope = function () {
    return [createHead(), createTail()];
}

const headOfRope = function (rope) {
    return rope[0];
}

const tailOfRope = function (rope) {
    return rope[1];
}

const moveHeadTo = function (rope, direction) {
    const head = headOfRope(rope);
    const headPosition = position(head);
    updatePosition(headPosition, direction);
}

const makeTailAdjacentToHead = function (rope) {
    const head = headOfRope(rope);
    const tail = tailOfRope(rope);

    const headPosition = position(head);
    const tailPosition = position(tail);

    if (arePositionsTouching(headPosition, tailPosition)) {
        return;
    }

    if (hor(headPosition) === hor(tailPosition)) {
        updatePosition(tailPosition, vert(headPosition) > vert(tailPosition) ? 'U' : 'D');
    } else if (vert(headPosition) === vert(tailPosition)) {
        updatePosition(tailPosition, hor(headPosition) > hor(tailPosition) ? 'R' : 'L');
        return;
    } else {
        updatePosition(tailPosition, hor(headPosition) > hor(tailPosition) ? 'R' : 'L');
        updatePosition(tailPosition, vert(headPosition) > vert(tailPosition) ? 'U' : 'D');
    }


    return;
}

const countNumberOfPositionsTheTailOfRopeVisitedAtLeastOnce = function (rope, directions) {
    directions.forEach(dir => {
        moveHeadTo(rope, dir);
        makeTailAdjacentToHead(rope);
    });
    return rope;
}

const parseDirections = function (input) {
    return input.split('\n')
        .flatMap(motion => {
            const [direction, count] = motion.split(" ");
            return Array(+count).fill(direction);
        });
}

test('tail rope position visits', () => {
    expect(countNumberOfPositionsTheTailOfRopeVisitedAtLeastOnce(createRope(), parseDirections(testInput))).toBe(13);
});


const testInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
