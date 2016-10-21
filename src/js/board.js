var Board = {};


Board.elements = {
    '1': document.getElementById('board-item-1'),
    '2': document.getElementById('board-item-2'),
    '3': document.getElementById('board-item-3'),
    '4': document.getElementById('board-item-4'),
    '5': document.getElementById('board-item-5'),
    '6': document.getElementById('board-item-6'),
    '7': document.getElementById('board-item-7'),
    '8': document.getElementById('board-item-8')
};


Board.draw = function(state) {
    state.split('').forEach(function(item, index) {
        if (item == '0') return;

        var element = Board.elements[item];
        var row = Math.floor(index / 3);
        var column = index % 3;

        element.style.top = (row * element.offsetHeight) + 'px';
        element.style.left = (column * element.offsetWidth) + 'px';
    });
}

Board.replayTimeout = null;
Board.replayAnimationTimeout = null;

Board.replay = function(moves) {
    Board.clearReplay();

    var initialState = moves.shift();
    Board.draw(initialState);
    window.network.selectNodes([initialState]);

    var animate = function(moves) {
        var move = moves.shift();
        if (!move) return boardDiv.classList.remove('animation');
        Board.draw(move);
        window.network.selectNodes([move]);
        Board.replayAnimationTimeout = setTimeout(animate.bind(null, moves), 1000);
    };

    Board.replayTimeout = setTimeout(function() {
        animate(moves);
    }, 1000);
};


Board.clearReplay = function() {
    clearTimeout(Board.replayTimeout);
    clearTimeout(Board.replayAnimationTimeout);
    boardDiv.classList.remove('animation');
};
