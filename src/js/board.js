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
