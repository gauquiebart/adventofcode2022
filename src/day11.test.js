const chunk = function (array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        result.push(chunk);
    }
    return result;
}

const createItem = function (worryLevel) {
    return ['item', worryLevel];
}

const worryLevelOfItem = function (item) {
    return item[1];
}

const createMonkey = function (monkeyName, items, operatorFn, action) {
    return [monkeyName, items, operatorFn, action, 0];
}

const itemsOfMonkey = function (monkey) {
    return monkey[1];
}

const clearItemsOfMonkey = function (monkey) {
    monkey[1] = [];
}

const addItemToMonkey = function (monkey, newItem) {
    itemsOfMonkey(monkey).push(newItem);
}

const operatorFnOfMonkey = function (monkey) {
    return monkey[2][1];
}

const actionOfMonkey = function (monkey) {
    return monkey[3][1];
}

const actionDivisorOfMonkey = function(monkey) {
    return monkey[3][2];
}

const increaseTotalItemsInspectedOfMonkey = function(monkey, itemsInspected) {
    monkey[4] = monkey[4] + itemsInspected;
}

const totalItemsInspectedOfMonkey = function(monkey) {
    return monkey[4];
}

const operationOldPlusOld = function (old) {
    return old + old;
}

const operationOldTimesOld = function (old) {
    return old * old;
}

const operationOldPlusConstant = function (old, constant) {
    return old + constant;
}

const operationOldTimesConstant = function (old, constant) {
    return old * constant;
}

const parseOperationFn = function (operationInput) {
    const [_, operator, addend2] = operationInput.split(" ");
    if (operator === '+' && addend2 === 'old') return [operationInput, (old) => operationOldPlusOld(old)];
    if (operator === '*' && addend2 === 'old') return [operationInput, (old) => operationOldTimesOld(old)];
    if (operator === '+') return [operationInput, (old) => operationOldPlusConstant(old, +addend2)];
    if (operator === '*') return [operationInput, (old) => operationOldTimesConstant(old, +addend2)];
    throw new Error(`could not parse ${operationInput}`);
}

const parseAction = function (predicateDivisor, consequentMonkey, alternativeMonkey) {
    return [`divisible by ${predicateDivisor} ? throw to ${consequentMonkey} : throw to ${alternativeMonkey}`,
        (worryLevel) => {
            return (worryLevel % predicateDivisor) === 0 ? consequentMonkey : alternativeMonkey;
        },
        predicateDivisor];
}

const parseMonkeys = function (input) {
    return chunk(input.split(`\n`), 7)
        .map(monkeyToParse => {
            const [monkeyName, startingItems, operation, testCondition, testResolvedTrue, testResolvedFalse] = monkeyToParse;

            const monkeyNameCleanedUp = monkeyName.split(":")[0];
            const items = startingItems.split(":")[1].split(",").map(worryLevel => createItem(+(worryLevel.trim())));
            const operationFn = parseOperationFn(operation.split("=")[1].trim());
            const action = parseAction(
                +(testCondition.split(":")[1].trim().split(" ")[2].trim()),
                +(testResolvedTrue.split(":")[1].trim().split(" ")[3].trim()),
                +(testResolvedFalse.split(":")[1].trim().split(" ")[3].trim()));

            return createMonkey(monkeyNameCleanedUp, items, operationFn, action);
        });
}

const countMonkeyBusiness = function (monkeys, numberOfRounds, newWorryLevelFn) {
    for (let round = 1; round <= numberOfRounds; round++) {
        monkeys.forEach(monkey => {
                const items = itemsOfMonkey(monkey);
                increaseTotalItemsInspectedOfMonkey(monkey, items.length);
                items.forEach(item => {
                    const worryLevel = worryLevelOfItem(item);
                    const operator = operatorFnOfMonkey(monkey);
                    const newWorryLevel = newWorryLevelFn(operator(worryLevel));
                    const actionFn = actionOfMonkey(monkey);
                    const toNewMonkey = actionFn(newWorryLevel);
                    addItemToMonkey(monkeys[toNewMonkey], createItem(newWorryLevel));
                });
                clearItemsOfMonkey(monkey);
            }
        );
    }

    const compareFn = (monkeya, monkeyb) => totalItemsInspectedOfMonkey(monkeyb) - totalItemsInspectedOfMonkey(monkeya);
    const monkeysSortedAccordingToTotalItemsInspected = [...monkeys].sort(compareFn);

    return totalItemsInspectedOfMonkey(monkeysSortedAccordingToTotalItemsInspected[0])
        * totalItemsInspectedOfMonkey(monkeysSortedAccordingToTotalItemsInspected[1]);
}

const divideByThreeAndFloor = (worryLevel) => Math.floor(worryLevel / 3);

const buildWorryLevelReductionFunction = function(monkeys) {
    const toModulo = monkeys.reduce((accumulator, currentValue) => accumulator * actionDivisorOfMonkey(currentValue), 1);
    return (worryLevel) => worryLevel % toModulo;
}
test('count monkey business for dividebytthreeandfloor for test input', () => {
    expect(countMonkeyBusiness(parseMonkeys(testInput), 20, divideByThreeAndFloor)).toBe(10605);
});

test('count monkey business for dividebytthreeandfloor for puzzle input', () => {
    expect(countMonkeyBusiness(parseMonkeys(puzzleInput), 20, divideByThreeAndFloor)).toBe(58322);
});

test('count monkey business for otherreduction for test input', () => {
    const monkeys = parseMonkeys(testInput);
    expect(countMonkeyBusiness(monkeys, 10000, buildWorryLevelReductionFunction(monkeys))).toBe(2713310158);
});

test('count monkey business for otherreduction for puzzle input', () => {
    const monkeys = parseMonkeys(puzzleInput);
    expect(countMonkeyBusiness(monkeys, 10000, buildWorryLevelReductionFunction(monkeys))).toBe(13937702909);
});


const testInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const puzzleInput = `Monkey 0:
  Starting items: 59, 65, 86, 56, 74, 57, 56
  Operation: new = old * 17
  Test: divisible by 3
    If true: throw to monkey 3
    If false: throw to monkey 6

Monkey 1:
  Starting items: 63, 83, 50, 63, 56
  Operation: new = old + 2
  Test: divisible by 13
    If true: throw to monkey 3
    If false: throw to monkey 0

Monkey 2:
  Starting items: 93, 79, 74, 55
  Operation: new = old + 1
  Test: divisible by 2
    If true: throw to monkey 0
    If false: throw to monkey 1

Monkey 3:
  Starting items: 86, 61, 67, 88, 94, 69, 56, 91
  Operation: new = old + 7
  Test: divisible by 11
    If true: throw to monkey 6
    If false: throw to monkey 7

Monkey 4:
  Starting items: 76, 50, 51
  Operation: new = old * old
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 5

Monkey 5:
  Starting items: 77, 76
  Operation: new = old + 8
  Test: divisible by 17
    If true: throw to monkey 2
    If false: throw to monkey 1

Monkey 6:
  Starting items: 74
  Operation: new = old * 2
  Test: divisible by 5
    If true: throw to monkey 4
    If false: throw to monkey 7

Monkey 7:
  Starting items: 86, 85, 52, 86, 91, 95
  Operation: new = old + 6
  Test: divisible by 7
    If true: throw to monkey 4
    If false: throw to monkey 5`;
