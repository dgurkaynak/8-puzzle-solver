var SearchType = {
    BREADTH_FIRST: 'breadthFirst',
    UNIFORM_COST: 'uniformCost',
    DEPTH_FIRST: 'depthFirst',
    ITERATIVE_DEEPENING: 'iterativeDeepening',
    GREEDY_BEST: 'greedyBest',
    A_STAR: 'aStar'
};

function search(opt_options) {
    var options = _.assign({
        node: null,
        frontierList: [],
        expandedNodes: {},
        iteration: 0,
        iterationLimit: 1000,
        depthLimit: 0,
        expandCheckOptimization: false,
        callback: function() {},
        stepCallback: null,
        type: SearchType.BREADTH_FIRST,
        maxFrontierListLength: 0,
        maxExpandedNodesLength: 0,
        iterativeDeepeningIndex: 0
    }, opt_options || {});

    Board.draw(options.node.state);

    if (options.node.game.isFinished()) {
        return options.callback(null, options);
    }

    // Expand current node
    var expandedList = options.node.expand();
    options.expandedNodes[options.node.state] = options.node;
    options.maxExpandedNodesLength = Math.max(options.maxExpandedNodesLength, _.size(options.expandedNodes));

    // Filter just-expanded nodes
    var expandedUnexploredList = expandedList.filter(function(node) {
        // Check iterative deeping index
        if (options.type == SearchType.ITERATIVE_DEEPENING && node.depth > options.iterativeDeepeningIndex)
            return false;

        // Check depth
        if (options.depthLimit && node.depth > options.depthLimit)
            return false;

        // Check whether node is already expanded (with lower cost)
        var alreadyExpandedNode = options.expandedNodes[node.state];
        if (alreadyExpandedNode && alreadyExpandedNode.cost <= node.cost) return false;

        // Check whether there is a better alternative (lower-cost) in frontier list
        var alternativeNode = _.find(options.frontierList, {state: node.state});
        if (alternativeNode && alternativeNode.cost <= node.cost)
            return false;
        else if (alternativeNode && alternativeNode.cost > node.cost) {
            _.remove(options.frontierList, alternativeNode);
        }

        return true;
    });

    // Add filtered just-expanded nodes into frontier list
    options.frontierList = options.frontierList.concat(expandedUnexploredList);
    options.maxFrontierListLength = Math.max(options.maxFrontierListLength, options.frontierList.length);

    // Check whether desired state is in just-expanded list
    if (options.expandCheckOptimization) {
        var desiredNode = _.find(expandedUnexploredList, function(unexploredNode) {
            return unexploredNode.game.isFinished();
        });

        if (desiredNode) {
            return options.callback(null, _.assign({}, options, {node: desiredNode}));
        }
    }

    // Next call
    var nextNode = getNextNode(options);
    if (!nextNode) {
        return options.callback(new Error('Frontier list is empty'), options);
    }

    // Iteration check
    options.iteration++;
    if (options.iterationLimit && options.iteration > options.iterationLimit) {
        return options.callback(new Error('Iteration limit reached'), options);
    }

    if (window.searchStopped) {
        window.searchStopped = false;
        return options.callback(new Error('Search stopped'), options);
    }

    if (options.stepCallback) {
        options.stepCallback(_.assign(options, {node: nextNode}));
    } else {
        setTimeout(function() {
            search(_.assign(options, {node: nextNode}));
        }, 0);
    }
}


function getNextNode(options) {
    switch (options.type) {
        case SearchType.BREADTH_FIRST:
            return options.frontierList.shift();
        case SearchType.DEPTH_FIRST:
            return options.frontierList.pop();
        case SearchType.UNIFORM_COST:
            var bestNode = _.minBy(options.frontierList, function(node) {
                return node.cost;
            });

            _.remove(options.frontierList, bestNode);

            return bestNode;
        case SearchType.ITERATIVE_DEEPENING:
            var nextNode = options.frontierList.pop();

            // Start from top
            if (!nextNode) {
                options.iterativeDeepeningIndex++;

                if (options.depthLimit && options.iterativeDeepeningIndex > options.depthLimit)
                    return;

                options.frontierList = [];
                options.expandedNodes = {};

                return new Node({state: game.state});
            }

            return nextNode;
        case SearchType.GREEDY_BEST:
            var bestNode = _.minBy(options.frontierList, function(node) {
                return node.game.getManhattanDistance();
            });

            _.remove(options.frontierList, bestNode);

            return bestNode;
        case SearchType.A_STAR:
            var bestNode = _.minBy(options.frontierList, function(node) {
                return node.game.getManhattanDistance() + node.cost;
            });

            _.remove(options.frontierList, bestNode);

            return bestNode;
        default:
            throw new Error('Unsupported search type');
    }
}
