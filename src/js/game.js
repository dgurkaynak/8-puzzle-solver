var Game = function(opt_state) {
    this.state = opt_state || '012345678';
};


Game.Actions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};


Game.DesiredState = '123456780';


Game.prototype.getAvaliableActionsAndStates = function() {
    var result = {};

    var zeroIndex = this.state.indexOf('0');
    var row = Math.floor(zeroIndex / 3);
    var column = zeroIndex % 3;

    if (column > 0) result[Game.Actions.LEFT] = this.getNextState(Game.Actions.LEFT);
    if (column < 2) result[Game.Actions.RIGHT] = this.getNextState(Game.Actions.RIGHT);
    if (row > 0) result[Game.Actions.UP] = this.getNextState(Game.Actions.UP);
    if (row < 2) result[Game.Actions.DOWN] = this.getNextState(Game.Actions.DOWN);

    return result;
};


Game.prototype.getNextState = function(action) {
    var zeroIndex = this.state.indexOf('0');
    var newIndex;

    switch (action) {
        case Game.Actions.LEFT:
            newIndex = zeroIndex - 1
            break;
        case Game.Actions.RIGHT:
            newIndex = zeroIndex + 1
            break;
        case Game.Actions.UP:
            newIndex = zeroIndex - 3
            break;
        case Game.Actions.DOWN:
            newIndex = zeroIndex + 3
            break;
        default:
            throw new Error('Unexpected action');
    }

    var stateArr = this.state.split('');
    stateArr[zeroIndex] = stateArr[newIndex];
    stateArr[newIndex] = '0';
    return stateArr.join('');
};


Game.prototype.isFinished = function() {
    return this.state == Game.DesiredState;
};


Game.prototype.randomize = function() {
    var that = this;
    var states = {};
    // var iteration = parseInt(prompt('How many random moves from desired state?'));
    var iteration = 100;

    if (!iteration || isNaN(iteration))
        return alert('Invalid iteration count, please enter a number');

    this.state = Game.DesiredState;
    states[this.state] = true;

    var randomNextState = function() {
        var state = _.sample(that.getAvaliableActionsAndStates());

        if (states[state])
            return randomNextState();

        return state;
    }

    _.times(iteration, function() {
        that.state = randomNextState();
    });
};


Game.prototype.getManhattanDistance = function() {
    var distance = 0;

    var oneIndex = this.state.indexOf('1');
    var onePosition = Game.indexToRowColumn(oneIndex);
    distance += Math.abs(0 - onePosition.row) + Math.abs(0 - onePosition.column);

    var twoIndex = this.state.indexOf('2');
    var twoPosition = Game.indexToRowColumn(twoIndex);
    distance += Math.abs(0 - twoPosition.row) + Math.abs(1 - twoPosition.column);

    var threeIndex = this.state.indexOf('3');
    var threePosition = Game.indexToRowColumn(threeIndex);
    distance += Math.abs(0 - threePosition.row) + Math.abs(2 - threePosition.column);

    var fourIndex = this.state.indexOf('4');
    var fourPosition = Game.indexToRowColumn(fourIndex);
    distance += Math.abs(1 - fourPosition.row) + Math.abs(0 - fourPosition.column);

    var fiveIndex = this.state.indexOf('5');
    var fivePosition = Game.indexToRowColumn(fiveIndex);
    distance += Math.abs(1 - fivePosition.row) + Math.abs(1 - fivePosition.column);

    var sixIndex = this.state.indexOf('6');
    var sixPosition = Game.indexToRowColumn(sixIndex);
    distance += Math.abs(1 - sixPosition.row) + Math.abs(2 - sixPosition.column);

    var sevenIndex = this.state.indexOf('7');
    var sevenPosition = Game.indexToRowColumn(sevenIndex);
    distance += Math.abs(2 - sevenPosition.row) + Math.abs(0 - sevenPosition.column);

    var eightIndex = this.state.indexOf('8');
    var eightPosition = Game.indexToRowColumn(eightIndex);
    distance += Math.abs(2 - eightPosition.row) + Math.abs(1 - eightPosition.column);

    return distance;
};


Game.indexToRowColumn = function(index) {
    return {
        row: Math.floor(index / 3),
        column: index % 3
    };
}
