const canvas = document.createElement('canvas');
canvas.classList.add('background-canvas');
canvas.style.pointerEvents = 'auto';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
const pointCount = 100;
const mouse = { x: null, y: null };

class Point {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.boost = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = Math.min(15, this.radius * 5);
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.boost > 0) {
      this.boost *= 0.9;
      this.dx *= 0.98;
      this.dy *= 0.98;
    }

    if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

    const distance = Math.hypot(this.x - mouse.x, this.y - mouse.y);
    if (distance < 100) {
      const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
      const force = (100 - distance) / 100;
      this.boost = 1;
      this.dx += Math.cos(angle) * force * 2;
      this.dy += Math.sin(angle) * force * 2;
    }

    this.draw();
  }
}

function connectLines() {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function init() {
  points = [];
  for (let i = 0; i < pointCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    const radius = Math.random() * 2 + 1;
    const color = `rgba(255, 255, 255, 1)`;
    points.push(new Point(x, y, dx, dy, radius, color));
  }
}

function animate() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  points.forEach((point) => point.update());
  connectLines();

  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', () => {
  const oldWidth = canvas.width;
  const oldHeight = canvas.height;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  points.forEach((point) => {
    point.x = (point.x / oldWidth) * canvas.width;
    point.y = (point.y / oldHeight) * canvas.height;
  });
});

init();
animate();