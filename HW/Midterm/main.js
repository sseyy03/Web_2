document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  let heartX = width / 2;
  let heartY = height / 2;
  const enemies = [];
  const enemySpeed = 5;
  const enemyRadius = 5;
  let starX = Math.random() * width;
  let starY = Math.random() * height;
  let inGame = false;
  let buttonColor = '#808080'; // 초기 버튼 색상

  class Enemy {
    constructor(x, y, speed, radius, color) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.radius = radius;
      this.color = color;
    }

    update() {
      let dx = heartX - this.x;
      let dy = heartY - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      dx /= distance;
      dy /= distance;
      this.x += dx * this.speed;
      this.y += dy * this.speed;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  }

  function spawnEnemies() {
    const count = 5 + Math.floor(Math.random() * 11);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const spawnDistance = 20 + Math.max(width, height) / 2;
      const x = heartX + spawnDistance * Math.cos(angle);
      const y = heartY + spawnDistance * Math.sin(angle);
      const color = getRandomColor();
      enemies.push(new Enemy(x, y, enemySpeed, enemyRadius, color));
    }
  }

  function drawHeart() {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(0); 
    const heartScale = 3;
    ctx.beginPath();
    for (let t = -Math.PI; t < Math.PI; t += 0.01) {
      let x = 16 * Math.pow(Math.sin(t), 3) * heartScale;
      let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * heartScale;
      ctx.lineTo(x, y);
    }
    ctx.fillStyle = 'rgb(192, 0, 0)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  function drawStar() {
    ctx.save();
    ctx.translate(starX - heartX + width / 2, starY - heartY + height / 2); // 별의 위치를 조정합니다.
    ctx.beginPath();
    const spikes = 5;
    const outerRadius = 30;
    const innerRadius = 15;
    let rot = Math.PI / 2 * 3;
    let x = 0;
    let y = -outerRadius;
    const step = Math.PI / spikes;

    ctx.moveTo(x, y);
    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();
  }

  function drawScene() {
    ctx.clearRect(0, 0, width, height);
    drawHeart();
    drawStar();
    enemies.forEach(enemy => {
      enemy.update();
      enemy.draw();
    });
  }

  function startGame() {
    inGame = true;
    setTimeout(() => {
      setInterval(spawnEnemies, 1000);
      requestAnimationFrame(updateGame);
    }, 1000);
  }

  function updateGame() {
    drawScene();
    requestAnimationFrame(updateGame);
  }

  function drawTitle() {
    ctx.fillStyle = '#72f2f2';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '48px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('중간고사게임', width / 2, height / 2 - 50);
    ctx.fillStyle = buttonColor;
    ctx.fillRect(width / 2 - 75, height / 2 + 100, 150, 50);
    ctx.fillStyle = 'black';
    ctx.fillText("시작", width / 2, height / 2 + 125);
  }

  canvas.addEventListener('mousemove', function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (x >= width / 2 - 75 && x <= width / 2 + 75 && y >= height / 2 + 100 && y <= height / 2 + 150) {
      buttonColor = '#000080'; 
    } else {
      buttonColor = '#808080'; 
    }
    drawTitle();
  });

  canvas.addEventListener('mousedown', function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (x >= width / 2 - 75 && x <= width / 2 + 75 && y >= height / 2 + 100 && y <= height / 2 + 150) {
      buttonColor = '#ff0000'; 
      drawTitle();
      startGame();
    }
  });

  drawTitle();
});
