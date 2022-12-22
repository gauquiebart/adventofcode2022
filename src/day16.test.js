"use strict";

class Valve {
    constructor(name, flowRate) {
        this.name = name;
        this.flowRate = flowRate;
        this.tunnels = new Set();
    }

    setTunnels(tunnels) {
        this.tunnels = tunnels;
    }
}

class Node {
    constructor(valve, actions) {
        this.valve = valve;
        this.actions = actions;
    }

    setActions(actions) {
        this.actions = actions;
    }
}

class Action {
    constructor(takeTunnel, openValve, node) {
        this.takeTunnel = takeTunnel;
        this.openValve = openValve;
        this.node = node;
    }
}

const parseInput = function (input) {
    const valves = input
        .split('\n')
        .map(l => {
            const matches = l.match(/Valve (\w.*) has flow rate=(\d.*)\;.*/i);
            return new Valve(matches[1], +matches[2]);
        });

    input
        .split('\n')
        .map((l, index) => {
            const valveToUpdate = valves[index];
            const tunnelsToOtherValves =
                l
                    .match(/.*; tunnels? leads? to valves? (.*)/i)[1]
                    .split(",")
                    .map(valveName => valves.find(v => v.name === valveName.trim()));
            valveToUpdate.setTunnels(tunnelsToOtherValves);

        });

    const result = new Map();
    new Set([...valves])
        .forEach(valve =>
            result.set(valve.name, valve));
    return result;
}

const permuteActions = function (valves, start, depth) {
    if(depth === 0) {
        return undefined;
    }
    const valve = valves.get(start);
    const tunnels = valve.tunnels;
    const actions = tunnels.map(tunnel => new Action(true, false, new Node(tunnel)));
    if(valve.flowRate > 0) {
        actions.push(new Action(false, true, new Node(valve)));
    }
    const result =
        new Node(
            valve,
            actions);

    for(let action of result.actions) {
        let node = action.node;
        const nodeWithActions = permuteActions(valves, node.valve.name, depth - 1);
        if(nodeWithActions){
            node.setActions(nodeWithActions.actions);
        }
    }
    return result;
}

test('can parse test input', () => {
    expect(parseInput(testInput).size).toEqual(10);
});

test.only('can permute actions up to a given depth', () => {
    const valves = parseInput(testInput);

    const valveAA = valves.get("AA");
    const valveBB = valves.get("BB");
    const valveCC = valves.get("CC");
    const valveDD = valves.get("DD");
    const valveEE = valves.get("EE");
    const valveII = valves.get("II");
    const valveJJ = valves.get("JJ");

    const actual = permuteActions(valves, "AA", 2);

    expect(actual)
        .toEqual(
            new Node(
                valveAA,
                [
                    new Action(
                        true,
                        false,
                        new Node(
                            valveDD,
                            [
                                new Action(true, false, new Node(valveCC)),
                                new Action(true, false, new Node(valveAA)),
                                new Action(true, false, new Node(valveEE)),
                                new Action(false, true, new Node(valveDD))])),
                    new Action(
                        true,
                        false,
                        new Node(
                            valveII,
                            [
                                new Action(true, false, new Node(valveAA)),
                                new Action(true, false, new Node(valveJJ))
                            ])),
                    new Action(true,
                        false,
                        new Node(
                            valveBB,
                            [
                                new Action(true, false, new Node(valveCC)),
                                new Action(true, false, new Node(valveAA)),
                                new Action(false, true, new Node(valveBB))
                            ]))]));
});

test('can parse puzzle input', () => {
    expect(parseInput(puzzleInput).size).toEqual(59);
});


const testInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const puzzleInput = `Valve SZ has flow rate=0; tunnels lead to valves GQ, YZ
Valve SP has flow rate=0; tunnels lead to valves LJ, AA
Valve LQ has flow rate=0; tunnels lead to valves EY, JT
Valve AT has flow rate=17; tunnels lead to valves DX, BU, NE, BR, TD
Valve IR has flow rate=0; tunnels lead to valves XN, UI
Valve CF has flow rate=0; tunnels lead to valves XN, BR
Valve TE has flow rate=0; tunnels lead to valves YA, RY
Valve GQ has flow rate=22; tunnels lead to valves SZ, AQ, OW, XJ
Valve DX has flow rate=0; tunnels lead to valves HI, AT
Valve AQ has flow rate=0; tunnels lead to valves AZ, GQ
Valve NE has flow rate=0; tunnels lead to valves AT, IA
Valve OC has flow rate=4; tunnels lead to valves PE, QV, QI, LJ, WX
Valve JO has flow rate=0; tunnels lead to valves AA, UI
Valve BR has flow rate=0; tunnels lead to valves CF, AT
Valve ZW has flow rate=0; tunnels lead to valves JH, EY
Valve TD has flow rate=0; tunnels lead to valves AT, WX
Valve BU has flow rate=0; tunnels lead to valves AT, ES
Valve QI has flow rate=0; tunnels lead to valves OC, XN
Valve PE has flow rate=0; tunnels lead to valves CI, OC
Valve WX has flow rate=0; tunnels lead to valves TD, OC
Valve IA has flow rate=0; tunnels lead to valves UI, NE
Valve TR has flow rate=18; tunnel leads to valve HI
Valve JK has flow rate=0; tunnels lead to valves QV, UI
Valve UB has flow rate=0; tunnels lead to valves OM, AA
Valve KW has flow rate=0; tunnels lead to valves YL, MD
Valve AL has flow rate=0; tunnels lead to valves ZL, WZ
Valve VK has flow rate=11; tunnels lead to valves OM, ZL, CI, VA, XJ
Valve FF has flow rate=0; tunnels lead to valves VD, AA
Valve MD has flow rate=0; tunnels lead to valves KW, YA
Valve VA has flow rate=0; tunnels lead to valves AZ, VK
Valve CI has flow rate=0; tunnels lead to valves VK, PE
Valve LJ has flow rate=0; tunnels lead to valves SP, OC
Valve YL has flow rate=23; tunnels lead to valves OW, KW
Valve JH has flow rate=0; tunnels lead to valves RK, ZW
Valve ES has flow rate=13; tunnel leads to valve BU
Valve OM has flow rate=0; tunnels lead to valves UB, VK
Valve QV has flow rate=0; tunnels lead to valves OC, JK
Valve XN has flow rate=7; tunnels lead to valves QI, VD, IR, CF, OG
Valve EY has flow rate=10; tunnels lead to valves ZW, LQ, XC, RC
Valve XJ has flow rate=0; tunnels lead to valves GQ, VK
Valve HI has flow rate=0; tunnels lead to valves DX, TR
Valve VD has flow rate=0; tunnels lead to valves FF, XN
Valve RY has flow rate=0; tunnels lead to valves AZ, TE
Valve YZ has flow rate=0; tunnels lead to valves SZ, YA
Valve YA has flow rate=12; tunnels lead to valves YZ, MD, TE
Valve AZ has flow rate=14; tunnels lead to valves AQ, RC, RY, VA
Valve ZL has flow rate=0; tunnels lead to valves AL, VK
Valve UE has flow rate=0; tunnels lead to valves RK, UI
Valve WZ has flow rate=25; tunnel leads to valve AL
Valve EB has flow rate=0; tunnels lead to valves AA, XC
Valve UI has flow rate=8; tunnels lead to valves UE, JK, IR, JO, IA
Valve AA has flow rate=0; tunnels lead to valves UB, JO, FF, EB, SP
Valve OG has flow rate=0; tunnels lead to valves XN, DF
Valve RC has flow rate=0; tunnels lead to valves AZ, EY
Valve JT has flow rate=21; tunnel leads to valve LQ
Valve DF has flow rate=0; tunnels lead to valves OG, RK
Valve RK has flow rate=9; tunnels lead to valves DF, JH, UE
Valve OW has flow rate=0; tunnels lead to valves YL, GQ
Valve XC has flow rate=0; tunnels lead to valves EY, EB`;
