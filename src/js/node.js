var Node = function(opt_data) {
    var data = opt_data || {};

    this.state = data.state || '012345678';
    this.parent = data.parent || null;
    this.cost = data.cost || 0;
    this.depth = data.depth || 0;

    this.game = new Game(this.state);
}


Node.prototype.expand = function() {
    var that = this;
    var result = [];

    var avaliableActionsAndStates = this.game.getAvaliableActionsAndStates();

    _.forEach(avaliableActionsAndStates, function(state, action) {
        var childData = {
            state: state,
            parent: that,
            depth: that.depth + 1,
            cost: that.cost + 1 // TODO: Bu cost'u game'den alman lazim
        };

        result.push(new Node(childData));
    });

    return result;
}
