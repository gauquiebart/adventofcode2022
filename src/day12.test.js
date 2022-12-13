
const graph = {
    start: {A: 5, B: 2},
    A: {start: 1, C: 4, D: 2},
    B: {A: 8, D: 7},
    C: {D: 6, finish: 3},
    D: {finish: 1},
    finish: {},
};

//borrowed from dijkstra and https://stackoverflow.com/questions/66505722/my-dijkstras-algorithm-implementation-does-not-return-shortest-path/66506658#66506658
/* MinHeap minimised - taken from https://stackoverflow.com/a/66511107/5459839 */
const MinHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};

function DijkstraShortestPath(graph, start, end) {
    // Heap with one entry: distance is 0 at start, and there is no previous.
    let heap = [[0, start, null]];
    let prev = {};

    while (heap.length) {
        let [distance, current, cameFrom] = MinHeap.pop(heap);
        if (current in prev) continue; // Already visited
        prev[current] = cameFrom; // Mark as visited
        if (current == end) { // Found!
            // Reconstruct path
            let path = [];
            while (current) {
                path.push(current);
                current = prev[current];
            }
            path.reverse();
            return { path, distance };
        }
        // Push unvisited neighbors on the heap
        for (let [neighbor, edge] of Object.entries(graph[current])) {
            if (!(neighbor in prev)) MinHeap.push(heap, [distance + edge, neighbor, current]);
        }
    }
}

const buildNodeName = function (row, column, nodeValue) {
    if (nodeValue === "S") {
        return `START`;
    }
    if (nodeValue === "E") {
        return `END`;
    }
    return `${row}:${column}_${nodeValue}`;
}

const vertexPossible = function (from, to) {
    if (to === 'E') {
        to = 'z';
    }
    return ((to <= from || (to.charCodeAt(0) - 1) === from.charCodeAt(0)) && to !== 'S')
        || from === 'S';
}

const parseGraph = function (input) {
    const nodesMatrix = input.split('\n').map(line => line.split(''));
    const numberOfRows = nodesMatrix.length;
    const numberOfColumns = nodesMatrix[0].length;

    const result = {};
    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < numberOfColumns; column++) {
            const currentNodeValue = nodesMatrix[row][column];
            const currentNodeName = buildNodeName(row, column, currentNodeValue);
            const edges = {};

            if (column > 0) {
                const nodeToLeftValue = nodesMatrix[row][column - 1];
                if (vertexPossible(currentNodeValue, nodeToLeftValue)) {
                    edges[buildNodeName(row, column - 1, nodeToLeftValue)] = 1;
                }
            }

            if (column < (numberOfColumns - 1)) {
                const nodeToRightValue = nodesMatrix[row][column + 1];
                if (vertexPossible(currentNodeValue, nodeToRightValue)) {
                    edges[buildNodeName(row, column + 1, nodeToRightValue)] = 1;
                }
            }

            if (row > 0) {
                const nodeToUpValue = nodesMatrix[row - 1][column];
                if (vertexPossible(currentNodeValue, nodeToUpValue)) {
                    edges[buildNodeName(row - 1, column, nodeToUpValue)] = 1;
                }
            }

            if (row < (numberOfRows - 1)) {
                const nodeToDownValue = nodesMatrix[row + 1][column];
                if (vertexPossible(currentNodeValue, nodeToDownValue)) {
                    edges[buildNodeName(row + 1, column, nodeToDownValue)] = 1;
                }
            }

            result[currentNodeName] = edges;
        }
    }

    return result;
}

const findAllStartPoints = function (graph) {
    return Object.keys(graph)
        .filter(key =>
            key === 'START' ||
            key.endsWith('a'));
}

const DijkstraShortestPathForAllStartPoints = function (graph) {
    return Math.min(...findAllStartPoints(graph)
        .map(startPoint => DijkstraShortestPath(graph, startPoint, "END"))
        .filter(result => result !== undefined)
        .map(result => result.distance));
}

test('find shortest path for test graph', () => {
    expect(DijkstraShortestPath(graph, "start", "finish").distance).toEqual(8);
});

test('find shortest path from Start to End for test input', () => {
    expect(DijkstraShortestPath(parseGraph(testInput), "START", "END").distance).toEqual(31);
});

test('find shortest path from A-ny to End for test input', () => {
    expect(DijkstraShortestPathForAllStartPoints(parseGraph(testInput), "START", "END")).toEqual(29);
});

test('find shortest path from Start to End for puzzle input', () => {
    expect(DijkstraShortestPath(parseGraph(puzzleInput), "START", "END").distance).toEqual(490);
});

test('find shortest path from A-ny to End for puzzle input', () => {
    expect(DijkstraShortestPathForAllStartPoints(parseGraph(puzzleInput), "START", "END")).toEqual(488);
});

const testInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const puzzleInput = `abccccccccccccccccccccaaaaaaaacccccccccccccaacaaaaacccccccccccccccccccccaaaaaacccccaaaaaccccccccccccccccccccaaaccccccccccccccccccccccccccccccccccccccccccccccccccccccccccaaaa
abcccccccccccccccccccaaaaaaaaacccccccccccccaaaaaaaaccccccccccccccaacccccaaaaaaaaaaaaaaaaccccccccccccccccccccaaaccccccccccccccccccccccccaccaccccccccccccccccccccccccccccaaaaaa
abccccccccccccccccccaaaaaaaaaacccccaacccccccaaaaaccccccccccccccaaaaaacccaaaaaaaaaaaaaaaaccccccccccccccccccaacaaaaacccccccccccccccccccccaaaaccccccccccccccccccccccccccccaaaaaa
abccccccccccaaacaaacaaacaaacccccacaaaccccccccaaaaacccccccccccccaaaaaacaaaaaaaaaaaaaaaaaaccccccccccccccccccaaaaaaaaccccccccccccccccccccaaaaaccccccccaaaccccaaaccccccccccaaacaa
abccccccccaaaaaccaaaaaccaaaccccaaaaaaaacccccaaacaaccccccccccccccaaaaccaaaaaaaaccccaaaaaacccccccccccccccccccaaaaaccccccccccccccccccccccaaaaaacccccccaaaacccaaaccccccccccccccaa
abccccccccaaaaaaccaaaaaaaaaaaccaaaaaaaaccccccaacccccccccccccccccaaaacaaaacaaaacccccaaacccccccaacaaccccccccccaaaaacccaaccccccccccccccccaaaaaaccccccccaaaaaaaacccccccccccccccaa
abccccccccaaaaaaaaaaaaaaaaaaacccaaaaaaccccccccccccccccccccccccccaccaccccccaaaaaccccccccccccccaaaaacccccccccaaacaacaaaaaaccccccccccccccccaacccccccckkkkkkaaaaccccccccccccccccc
abccccccccaaaaacaaaaaccaaaaaaaacaaaaaccccccccccccccccccccccccccccccccccccccaaaccccccccccccccccaaaaacccccccccaaccccaaaaaaccccccccccccccccccccccccckkkkkkklaaccccccccaacccccccc
abccccccccaaaaacaacaaacaaaaaaaacaaaaaacccccccccccccccccccccaacccccccccccccccaaaccccccccccccccaaaaaacccccccccccccccaaaaaacccccccccccccccccccccccckkkkkkkklllccccccccccaaaacccc
abcaaccccccccccccccaaaccaaaaaaaccccaaccccccccccccccccccaaccaacccccccccccccccccccaacccccccccccaaaacccccccccccccccccaaaaacccccccaaaacccccccccccccckkkoppppllllllccccccccaaccccc
abcaacccccccccccccccccccaaaaaccccccccccccccccccccccccccaaaaaacccccccccccccccccaaaaaacccccccccccaaccccccccccccccccccaaaacccccccaaaaacccccccccccckkkooppppplllllllllccccdaccccc
abaaaccccccaaacccccccccaaaaaaccccccccaaaccccccccccccccccaaaaaaacccccccccccccccaaaaaacccccccccccccccccccccccccccccccccccccccccaaaaaaccccccccccccjkoooopuppplllllllmmmddddacccc
abaaaaaccccaaaaacccccccccccaaaaacccccaaaaccccccccccccccccaaaaaaccccccccccccccccaaaacccccccccccccccccaaaccccccccccccccccccccccaaaaaacccccccccccjjjooouuuuppppppqqmmmmmdddacccc
abaaaaacccaaaaaacccaacaaacccaaaaaacccaaaacccccccccccccccaaaaaccccccccccaaccccccaaaaccccccaacccccacccaaccccccccccaacaaccccccccaaaaaacccaaaccccjjjjoouuuuuuppppqqqqqmmmdddacccc
abaaccacccaaaaaacccaaaaaacccaaaaaacccaaacccccccccccccccaaaaaaccccccccaaaaaaccccaccacccccaaaacccaaaaaaaccccccccccaaaaaccccccccccaacacccaaccccjjjjooouuuxuuupppqqqqqmmmdddccccc
abaaaccccccaaaaacccaaaaaacccaaaaaccccccccccccccccccccccccccaaccccccccaaaaaacccccccccccccaaaaccccaaaaaaaaccccccccaaaaaaccccccccccccaaaaaaacjjjjjoooouuxxxuuvvvvvvqqqmmdddccccc
abaaaccccccaacaacccaaaaaaacccaaaaacccccccccccccccaaacccccccccccccccccaaaaaccccaaacccccccaaaaccccaaaaaaaaacccccccaaaaaaccccccccccccaaaaaacjjjjjoooouuuxxxuuvvvvvvqqqmmdddccccc
abccccccccccccccccaaaaaaaacccaaaaacccccccccccccccaaaccccccccccccccccccaaaaacccaaacacccccccccccccaaaaaaaaacccccccaaaaaccccccaacccccaaaaaaajjjnoooottuuxxxxvyyyvvvqqmmmdddccccc
abccccccccccccccccaaaaaaaacccccccccccccccccaaaaaaaaaccaaccccccccccccccaaaaacaacaaaaaccccccccccccaaaaaaaaccccccccccaaacccccaaaaccccaaaaaajjjnnnntttttxxxxyyyyyvvvqqmmmdddccccc
abccccccaaaccccccccccaaacccaaccccccccccccccaaaaaaaaaaaaaaaccccccccaaacccccccaaaaaaaacccccccccccaaaaaaaaccccccccccccaacccccaaaaacacaaaaaaiiinnntttxxxxxxxyyyyyvvqqqmmdddcccccc
SbccccccaaaaaccccccccaaccccaaaccccccccccccccaaaaaaaaaaaaaacccccccaaaaaaccccccaaaaaccccccccacccaaaccaaacccccccccaaacaaccaaaaaaaaaaaaaaaaaiiinnntttxxxEzzzzyyyvvqqqmmmeeecccccc
abcccccaaaaaacccccccccccaaaaaaaaccccccccccccaaaaaaaaaaaaaccccccccaaaaaacccccccaaaaacccccccaacaaaccccaaacccccccccaaaaaccaaaaaaaaaacaccaaaiiinnntttxxxxxyyyyyvvvqqqnnneeecccccc
abaacccaaaaaacccccccccccaaaaaaaaccccaaaccccaaaaaaaaaaaaaaacccccccaaaaaccccccccaacaaaaaccccaaaaacccccccccccccccccaaaaaaaccaaaaaacccccccaaiiinnnttttxxxxyyyyyyvvvrrnnneeecccccc
abaaaaaaaaaaaccccccccccccaaaaaaccccaaaacccaaaaaaaaaaaaacaaccccccccaaaaacccccccaaccccaaaacccaaaaaacaacaaccccccccaaaaaaaaccaaaaaaccccccccciiiinnnttttxxwyywyyyyvvrrrnneeecccccc
abaaaaacaacaaccccccccccccaaaaaaccccaaaacccaaacaaaacaaaccccccccccccaacaaccccaacccccaaaaaacaaaaaaaacaaaaacccccaaaaaaaaaaaccaaaaaacccccccccciiiinnnttttwwyywwywwwvrrrnneeecccccc
abaaaacccccccccccccccccccaaaaaacccccaaacccccccaaacccacaaccccccccccccccccccaaccccccaaaaaccaaaaaaaaaaaaaccccccaaaaaaaaacccaaaaaaaacccccccccciiinnnnntswwywwwwwwwwrrrnnneecccccc
abaaaaaccccccccccccccccccaacaaacccccccccccccccaacaaacaaacccccccccccccccaaaaacaaccccaaaaaccccaacccaaaaaacccccaaacaaaaaccccacccccccaaacccccciiiiinnmsswwwwwswwwwrrrrnnneecccccc
abaaaaaaccaaaccccccccccccccccccccccccccccccccccccaaaaaaaccccccccaaaccccaaaaaaaaccccaaccaccccaacccccaaaaccaaaaaaaaaaccccccccccccccaaaaacccccciihmmmsswwwwssrrrrrrrrnnneecccccc
abaaccaacaaaaccccccccccccccccccccccccccccccccccccaaaaaacccccccccaaaaaccccaaaaacccccccccccccccccccccacccccaaaaaaaaacccccccaaccaacaaaaacccccccchhhmmssswwsssrrrrrrrnnneeecccccc
abaacccccaaaacccccccccccccccccccccccccccccccccccccaaaaaaaacccccaaaaaacccaaaaacccccccccccccccccccccccccccccaaaaaaaccccccccaaaaaacaaaaacccccccchhhmmssssssslllllllnnnnfeecccccc
abccccccccaaacccccccccccccccaaccccccccccccccaaaccaaaaaaaaacccccaaaaaacccaacaaaccccccccccccccccccccccccaacccaaaaaaccccccccaaaaacccaaaaaccccccchhhmmmssssslllllllllnnfffeaacccc
abcccccccccccccccccccccccacaaaccccccccccccccaaaaaaaaaaaaaaccaaccaaaaaccccccaaccaacccccccccccccccccccccaaaccaaaaaaacccccccaaaaaaccaaccccccccccchhhmmmmsmllllllllllfffffaaacccc
abccccccccccccccccccccccaaaaaaaaccccccccccccaaaaaaacaaacaaaaaaccaaaaccccccccccaaaacccccccccccccccccaaaaaaaaaaacaaaccccccaaaaaaaacccccccccccccchhhmmmmmmlllggfffffffffaacccccc
abccccccccccccccccccccccaaaaaaaaccccccccccccaaacccccaaacaaaaacccccccccccaaacccaaaacccccccccccccccccaaaaaaaaaacccccccccccaaaaaaaaccccccccccccccchhhmmmmmlggggffffffffaaacccccc
abccccccccccccccccaaaacccaaaaaacccccccccccccccccccccaaacaaaaaaccccccccccaaacccaaaaccccccacccccccccccaaaaaacccccccccccccccccaacccaaccccccccccccchhhhgmgggggggffaccccccaacccccc
abccccccccccccccccaaaacccaaaaacccccccccccccccccccccccccaaaaaaaacccccccccaaaaccaaacccccccaaacaaacccccaaaaaacccccccccccccccccaaccaaccccccccccccccchhhgggggggaaaaacccccccccccccc
abccccccccccccccccaaaacccaaaaaaccccccccccccccccccccccccaaaaaaaaccccccccccaaaaaaaaaccccccaaaaaaacccccaaaaaaccccccccccccccccccaaaaacaaccccccccccccchggggggaacccccccccccccccccca
abcccccccccccccccccaacccccccaaccccccccccccccccccccccccccccaacaccaaacccaacaaaaaaaacccccccaaaaaaccccccaaccaacaaaccacccccaaccccaaaaaaaaccccccccccccccccccaaaccccccccccccccccccca
abcccccaaccccccccccccccccaaccccccccaacccccccccaaacccccccccaacaaaaaacccaaacaaaaaacccccccaaaaaaacccccccccccccaaaaaacccaaaaccccccaaaaaccccaaacccccccccccccaaccccccccccccccaaaaaa
abccccaaaacccccccccccccccaaaacccaaaaccccccccccaaaacccccccccccaaaaaaccaaaaaaaaaacccccccaaaaaaaaaaccccccccccccaaaaacccaaaaaacccaaaaacccccaaaacccccccccccaaccccccccccccccccaaaaa
abccccaaaacccccccccccccaaaaaacccaaaaaaccccccccaaaaccccccccccaaaaaaaacaaaaaaaaaaaaaccccaaaaaaaaaaccccccccccaaaaaaaacccaaaaccccaacaaaccccaaaacccccccccccccccccccccccccccccaaaaa`;

