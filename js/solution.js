(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;
    
    function BinaryHeap(scoreFunction){
        this.content = [];
        this.scoreFunction = scoreFunction;
    }
    
    BinaryHeap.prototype = {
        push: function(element) {
            this.content.push(element);
    
            this.sinkDown(this.content.length - 1);
        },
        pop: function() {
            var result = this.content[0];
            var end = this.content.pop();
            if (this.content.length > 0) {
                this.content[0] = end;
                this.bubbleUp(0);
            }
            return result;
        },
        remove: function(node) {
            var i = this.content.indexOf(node);
    
            var end = this.content.pop();
    
            if (i !== this.content.length - 1) {
                this.content[i] = end;
    
                if (this.scoreFunction(end) < this.scoreFunction(node)) {
                    this.sinkDown(i);
                }
                else {
                    this.bubbleUp(i);
                }
            }
        },
        size: function() {
            return this.content.length;
        },
        rescoreElement: function(node) {
            this.sinkDown(this.content.indexOf(node));
        },
        sinkDown: function(n) {
            var element = this.content[n];
    
            while (n > 0) {
    
                var parentN = ((n + 1) >> 1) - 1,
                    parent = this.content[parentN];
                if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                    this.content[parentN] = element;
                    this.content[n] = parent;
                    n = parentN;
                }
    
                else {
                    break;
                }
            }
        },
        bubbleUp: function(n) {
            var length = this.content.length,
                element = this.content[n],
                elemScore = this.scoreFunction(element);
    
            while(true) {
                var child2N = (n + 1) << 1, child1N = child2N - 1;
                var swap = null;
                var child1Score;
                if (child1N < length) {
                    var child1 = this.content[child1N];
                    child1Score = this.scoreFunction(child1);
    
                    if (child1Score < elemScore){
                        swap = child1N;
                    }
                }
    
                if (child2N < length) {
                    var child2 = this.content[child2N],
                        child2Score = this.scoreFunction(child2);
                    if (child2Score < (swap === null ? elemScore : child1Score)) {
                        swap = child2N;
                    }
                }
    
                if (swap !== null) {
                    this.content[n] = this.content[swap];
                    this.content[swap] = element;
                    n = swap;
                }
    
                else {
                    break;
                }
            }
        }
    };

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {
        // todo: построить правильный маршрут к выходу
        return [
            [1, 0],
            [1, 1]
        ];
    }

    root.maze.solution = solution;
})(this);
