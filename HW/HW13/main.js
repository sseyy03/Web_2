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
        var cos = Math.cos(this.rotation);
        var sin = Math.sin(this.rotation);

        // 삼각형의 꼭지점 좌표 계산
        var Ax = this.position_X + 0 * cos - (-this.size) * sin;
        var Ay = this.position_Y + 0 * sin + (-this.size) * cos;
        var Bx = this.position_X + this.size * cos - this.size * sin;
        var By = this.position_Y + this.size * sin + this.size * cos;
        var Cx = this.position_X + (-this.size) * cos - this.size * sin;
        var Cy = this.position_Y + (-this.size) * sin + this.size * cos;

        // 직선 방정식을 이용해 점이 삼각형 내부에 있는지 확인하는 함수
        function isLeftOfLine(px, py, x1, y1, x2, y2) {
            return ((x2 - x1) * (py - y1) - (y2 - y1) * (px - x1)) >= 0;
        }

        var insideAB = isLeftOfLine(x, y, Ax, Ay, Bx, By);
        var insideBC = isLeftOfLine(x, y, Bx, By, Cx, Cy);
        var insideCA = isLeftOfLine(x, y, Cx, Cy, Ax, Ay);

        return insideAB && insideBC && insideCA;
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