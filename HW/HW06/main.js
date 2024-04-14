// 하트 객체 정의
class HeartObject {
    constructor(x, y, size, color, speed, rotationSpeed, direction) {
        // 생성자 함수에서 하트의 속성들을 초기화
        // (위치, 크기, 색상, 이동 속도, 회전 속도, 이동 방향)
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.rotationSpeed = rotationSpeed;
        this.direction = direction;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        // 하트의 중심 좌표

        ctx.rotate(this.rotationSpeed);
        //하트 회전, rotationSpeed는 스피드

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.size);
        //현재 위치를 지정된 (0, this.size) 좌표로 이동

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.01) {
            // 0부터 2π(한 바퀴)까지 각도를 증가시키면서 반복 이 각도에 따라 하트의 곡선을 만든다
            let x = this.size * (16 * Math.pow(Math.sin(angle), 3));
            let y = -this.size * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update() {
        // 하트의 위치를 업데이트하고 회전 속도를 조절하는 메서드
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
        this.rotationSpeed += 0.01; // 회전 속도 업데이트
    }
}

// 캔버스 요소 가져오기
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// HeartObject를 담을 배열
const hearts = [];

// 애니메이션 프레임 렌더링
function animate() {
    // 캔버스 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 하트 그리기
    // 하트를 그리고 위치를 업데이트
    hearts.forEach(heart => {
        heart.draw(ctx);
        heart.update();
    });

    // 다음 애니메이션 프레임 요청
    requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();

// 마우스 이벤트 추가
canvas.addEventListener('mousemove', function(event) {
    // 마우스 위치 얻기
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 하트 생성
    setTimeout(() => {
        const size = Math.random() * 10 + 5; // 크기 (5~15)
        const color = '#' + Math.floor(Math.random()*16777215).toString(16); // 랜덤한 색상
        const speed = Math.random() * 2 + 1; // 이동 속도 (1~3)
        const rotationSpeed = Math.random() * 0.1 - 0.05; // 회전 속도 (-0.05~0.05)
        const direction = Math.random() * Math.PI * 2; // 이동 방향

        const heart = new HeartObject(
            Math.min(Math.max(mouseX, 0), canvas.width), // 캔버스 내부에서만 생성
            Math.min(Math.max(mouseY, 0), canvas.height), // 캔버스 내부에서만 생성
            size,
            color,
            speed,
            rotationSpeed,
            direction
        );
        hearts.push(heart);

        // 배열 크기 제한
        if (hearts.length > 100) {
            hearts.shift(); // 가장 오래된 하트 제거
        }
    }, 200); // 0.2초 후에 하트 생성
});