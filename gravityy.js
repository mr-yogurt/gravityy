var GravitationalConstant = 5000;
//var distMultiplier = .001;
var minDistance = 100;

var gravityObjects = [];
var updateObjects = [];
var drawObjects = [];
var tempObjectsQueue = []; //this really should only have one or zero elements in it but I don't know of such a data structure. yay shitty coding hax
var FPS = 60;
var defWidth = $(window).width();
var defHeight = $(window).height();

function Canvas (width, height) {
    this.width = width;
    this.height = height;
    this.element = $("<canvas width='" + width + "' height='" + height + "'></canvas>");
    this.context = this.element.get(0).getContext("2d");
    this.element.appendTo("#screen");
    return this;
}

function GravityObject (x, y, xVelocity, yVelocity, mass) {
    this.x = x;
    this.y = y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    this.mass = mass;
    this.canvas = new Canvas(defWidth, defHeight);
    this.update = function() {
        for (var i = 0; i < gravityObjects.length; i++){ //I don't care if there's a better way to iterate through a list like this! If you want it done a better way then go do it yourself.
            if (gravityObjects[i] != this){
                var distance = (((this.x - gravityObjects[i].x) * (this.x - gravityObjects[i].x)) + ((this.y - gravityObjects[i].y) * (this.y - gravityObjects[i].y)));
                //if (distance < minDistance){ if i do this there are different problems
                //    distance = minDistance;
                //}
                var force = GravitationalConstant * (this.mass * gravityObjects[i].mass) / distance;
                var acceleration = force / this.mass;
                //var angleTo = Math.atan((this.y - gravityObjects[i].y) / (this.x - gravityObjects[i].x)); //this on the other hand I do need to find a better way for
                this.xVelocity += acceleration * ((this.x - gravityObjects[i].x) / distance) * -1;
                this.yVelocity += acceleration * ((this.y - gravityObjects[i].y) / distance) * -1;
            }
        }
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    };
    this.draw = function() {
        this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.context.beginPath();
        this.canvas.context.arc(this.x, this.y, mass, 0, Math.PI * 2);
        this.canvas.context.stroke();
    };
    gravityObjects.push(this);
    return this;
}

function tempGravityObject(x, y) { //the super bad practice. probably.
    this.mass = 0;
    this.px = x;
    this.py = y;
    this.x = x;
    this.y = y;
    this.u = 0;
    this.canvas = new Canvas(defWidth, defHeight);
    this.moveupdate = function(nx, ny) {
        this.px = this.x;
        this.py = this.y;
        this.x = nx;
        this.y = ny;
        this.u = 0;
    };
    this.update = function() {
        this.mass += 1;
        if(this.u >= 1) {
            this.px = this.x;
            this.py = this.y;
        } else {
            this.u += 1;
        }
    };
    this.draw = function() {
        this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.context.beginPath();
        this.canvas.context.arc(this.x, this.y, this.mass, 0, Math.PI * 2);
        this.canvas.context.stroke();
    };
    return this;
}

function intervalFunction() { //because I'm picky and don't want to write this in that other spot down there
    updateObjects.map(function(object) { object.update(); }); //something is undefined
    drawObjects.map(function(object) { object.draw(); });
    if(tempObjectsQueue.length > 0) {
        console.log(tempObjectsQueue[0]);
    }
}

$(document).ready(function() {
    $("div").mousedown(function(e) {
        var offset = $(this).offset();
        tempObjectsQueue.push(new tempGravityObject(e.clientX - offset.left, e.clientY - offset.top));
        $("div").mousemove(function(e) {
            var offset = $(this).offset();
            tempObjectsQueue.map(function(object) {object.moveupdate(e.clientX , e.clientY - offset.top);});
        });
        updateObjects.push(tempObjectsQueue[tempObjectsQueue.length - 1]);
        drawObjects.push(tempObjectsQueue[tempObjectsQueue.length - 1]);
    });
    $("div").mouseup(function(e) {
        var t = tempObjectsQueue.shift();
        updateObjects.splice(updateObjects.indexOf(t), 1);
        drawObjects.splice(drawObjects.indexOf(t), 1);
        newGravityObject = new GravityObject(t.x, t.y, t.x - t.px, t.y - t.py, t.mass);
        gravityObjects.push(newGravityObject);
        updateObjects.push(newGravityObject);
        drawObjects.push(newGravityObject);
        $(t.canvas.element).remove();
        //console.log(updateObjects);
    });
    setInterval(intervalFunction, 1000/FPS);
});