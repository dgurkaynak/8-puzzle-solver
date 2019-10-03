var Visualization = {};


Visualization.element = document.getElementById('visualization');


Visualization.draw = function(data) {
    var options = {
        layout: {
            hierarchical: {
                direction: 'UD',
                sortMethod: 'directed',
                levelSeparation: 150,
                nodeSpacing: 100,

            }
        },
        interaction: {dragNodes :false},
        physics: {
            enabled: false
        },
        configure: {
          filter: function (option, path) {
              if (path.indexOf('hierarchical') !== -1) {
                  return true;
              }
              return false;
          },
          showButton:false
        }
    };

    window.network = new vis.Network(Visualization.element, data, options);
    window.network.on('click', function (params) {
        if (params.nodes.length > 0) {
            Board.draw(params.nodes[0]);
            Board.clearReplay();
        }
    });
};


Visualization.importData = function(expandedNodes, frontierList, opt_winnerNode, opt_winnerColor) {
    var data = {
        nodes: [],
        edges: []
    };
    var winners = {};
    var importeds = {};

    function importNode(color, node) {
        if (importeds[node.state])
            return;

        data.nodes.push({
            id: node.state,//012345678
            label: node.state.splice(6, 0, '\n').splice(3, 0, '\n'),
            // label: node.state + '\n (D:' + node.depth + ', MD:' + node.game.getManhattanDistance() + ')',
            color: winners[node.state] ? (opt_winnerColor || '#ccff33') : color
        });

        if (node.parent) {
            data.edges.push({
                from: node.parent.state,
                to: node.state,
                id: node.parent.state + node.state
            });
        }

        importeds[node.state] = true;
    }

    if (opt_winnerNode) {
        function traverseWinnerNode(node) {
            winners[node.state] = true;
            if (node.parent) traverseWinnerNode(node.parent);
        }

        traverseWinnerNode(opt_winnerNode);
        importNode(null, opt_winnerNode);
    }

    _.forEach(expandedNodes, importNode.bind(null, '#eee'));
    _.forEach(frontierList, importNode.bind(null, null));

    return data;
};
