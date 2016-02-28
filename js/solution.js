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
    
    function Graph(grid) {
        var nodes = [];
    
        for (var x = 0; x < grid.length; x++) {
            nodes[x] = [];
    
            for (var y = 0, row = grid[x]; y < row.length; y++) {
                nodes[x][y] = new GraphNode(x, y, row[y]);
            }
        }
    
        this.input = grid;
        this.nodes = nodes;
    }
    
    function GraphNode(x,y,type) {
        this.data = { };
        this.x = x;
        this.y = y;
        this.pos = {
            x: x,
            y: y
        };
        this.type = type;
    }
    
    GraphNode.prototype.isWall = function() {
        return this.type === WALL;
    };
    
    var astar = {
        init: function(grid) {
            for(var x = 0, xl = grid.length; x < xl; x++) {
                for(var y = 0, yl = grid[x].length; y < yl; y++) {
                    var node = grid[x][y];
                    node.f = 0;
                    node.g = 0;
                    node.h = 0;
                    node.cost = node.type;
                    node.visited = false;
                    node.closed = false;
                    node.parent = null;
                }
            }
        },
        heap: function() {
            return new BinaryHeap(function(node) {
                return node.f;
            });
        },
        search: function(grid, start, end) {
            astar.init(grid);
            heuristic = astar.manhattan;
    
            var openHeap = astar.heap();
    
            openHeap.push(start);
    
            while(openHeap.size() > 0) {
    
                var currentNode = openHeap.pop();
    
                if(currentNode === end) {
                    var curr = currentNode;
                    var ret = [];
                    var in_ret = [];
                    while(curr.parent) {
                        in_ret = [];
                        in_ret.push(curr.y,curr.x);
                        ret.push(in_ret);
                        curr = curr.parent;
                    }
                    in_ret = [];
                    in_ret.push(start.y, start.x);               
                    ret.push(in_ret);
                    return ret.reverse();
                }
    
                currentNode.closed = true;
    
                var neighbors = astar.neighbors(grid, currentNode);
    
                for(var i=0, il = neighbors.length; i < il; i++) {
                    var neighbor = neighbors[i];
    
                    if(neighbor.closed || neighbor.isWall()) {
                        // Not a valid node to process, skip to next neighbor.
                        continue;
                    }
    
                    var gScore = currentNode.g + neighbor.cost;
                    var beenVisited = neighbor.visited;
    
                    if(!beenVisited || gScore < neighbor.g) {
    
                        neighbor.visited = true;
                        neighbor.parent = currentNode;
                        neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;
    
                        if (!beenVisited) {
                            openHeap.push(neighbor);
                        }
                        else {
                            openHeap.rescoreElement(neighbor);
                        }
                    }
                }
            }
    
            return [];
        },
        manhattan: function(pos0, pos1) {
    
            var d1 = Math.abs (pos1.x - pos0.x);
            var d2 = Math.abs (pos1.y - pos0.y);
            return d1 + d2;
        },
        neighbors: function(grid, node) {
            var ret = [];
            var x = node.x;
            var y = node.y;
    
            if(grid[x-1] && grid[x-1][y]) {
                ret.push(grid[x-1][y]);
            }
    
            if(grid[x+1] && grid[x+1][y]) {
                ret.push(grid[x+1][y]);
            }
    
            if(grid[x] && grid[x][y-1]) {
                ret.push(grid[x][y-1]);
            }
    
            if(grid[x] && grid[x][y+1]) {
                ret.push(grid[x][y+1]);
            }
    
            return ret;
        }
    };
    
    function SearchClosestFinish(Data, maze){
      var size = maze[Data[0].y][Data[0].x];
      for (var i = 0; i < Data.length; i++) {
      if(maze[Data[i].y][Data[i].x]<=size){
            size = maze[Data[i].y][Data[i].x];
            Data.x = Data[i].x;
            Data.y = Data[i].y;
      }
      delete Data[i]; 
      };
      return Data;

    }

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {
    var graph = new Graph(maze);
      var start = graph.nodes[y][x],
      finish = [],
      index = 0;
      var route = [];

      for (var i = 0; i < maze[maze.length-1].length; i++) {              
            if (maze[maze.length-1][i]===0) {
                finish[index] = {x: i, y: maze.length-1};
                index++;
            }   
      }

      SearchClosestFinish(finish, maze);
      var end = graph.nodes[finish.y][finish.x];
      route = astar.search(graph.nodes, start, end);

      return route;
    }

    root.maze.solution = solution;
})(this);
