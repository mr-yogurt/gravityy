var GravitationalConstant = 5;
var minDistance = 100;

var gravityObjects = []
var FPS = 60;
var defWidth = $(window).width() - 20;
var defHeight = $(window).height() - 20;

function Canvas (width, height) {
    this.width = width;
    this.height = height;
    this.element = $("<canvas width='" + width + "' height='" + height + "'></canvas>");
    this.context = this.element.get(0).getContext("2d");
    this.element.appendTo("#screen");
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
}

function intervalFunction() { //because I'm picky and don't want to write this in that other spot down there
    gravityObjects.map(function(object) {object.update()});
    gravityObjects.map(function(object) {object.draw()});
}

$(document).ready(function() { //runs when the document can safely be modified.
    gravityObjects.push(new GravityObject(300, 320, 0, -.05, 20));
    gravityObjects.push(new GravityObject(500, 300, 0, 0, 30));
    gravityObjects.push(new GravityObject(400, 340, .1, 0, 40));
    setInterval(intervalFunction, 1000/FPS);
});