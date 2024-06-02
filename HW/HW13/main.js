document.addEventListener('DOMContentLoaded', function() {
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

class Triangle {
    constructor(posX, posY, rot, size, color) {
        this.position_X = posX;
        this.position_Y = posY;
        this.rotation = rot;
        this.size = size;
        this.color = color;
    }

    update() {
        this.rotation += 0.01;
    }

    draw() {
        ctx.save();
        ctx.translate(this.position_X, this.position_Y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    isInside(x, y) {
        var localX = x - this.position_X;
        var localY = y - this.position_Y;
        
        var cos = Math.cos(-this.rotation);
        var sin = Math.sin(-this.rotation);
        var rotatedX = localX * cos - localY * sin;
        var rotatedY = localX * sin + localY * cos;

        var v0 = [0, -this.size];
        var v1 = [this.size, this.size];
        var v2 = [-this.size, this.size];
        
        var b = (v1[0] - v0[0]) * (rotatedY - v0[1]) - (v1[1] - v0[1]) * (rotatedX - v0[0]);
        var c = (v2[0] - v1[0]) * (rotatedY - v1[1]) - (v2[1] - v1[1]) * (rotatedX - v1[0]);
        var a = (v0[0] - v2[0]) * (rotatedY - v2[1]) - (v0[1] - v2[1]) * (rotatedX - v2[0]);
        
        return (a <= 0 && b <= 0 && c <= 0) || (a >= 0 && b >= 0 && c >= 0);
    }
}

var triangle = new Triangle(canvas.width / 2, canvas.height / 2, 0, 100, "green");

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triangle.update();
    triangle.draw();
    requestAnimationFrame(draw);
}

function handleClick(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    if (triangle.isInside(x, y)) {
        triangle.color = "red";
    } else {
        triangle.color = "green";
    }
}

canvas.addEventListener('click', handleClick);
draw();

});