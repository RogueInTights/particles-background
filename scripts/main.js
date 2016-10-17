document.addEventListener('DOMContentLoaded', () => {
    let canvasBody = document.querySelector('.drawing-area');
    let canvas = canvasBody.getContext('2d');
    
    let config = {
        maxX: canvasBody.width = window.innerWidth,
        maxY: canvasBody.height = window.innerHeight,

        minRadius: 1,
        maxRadius: 3,

        minSpeed: 1,
        maxSpeed: 3,

        backgroundColor: "#1e1e1e",
        color: "#fcfcfc",

        communicationRadius: 150,
        lineWidth: .5,
        lineColor: "rgba(255, 255, 255, govno)",

        initialAmount: 30
    };

    let particles = [];

    class Particle {
        constructor(x, y, color) {
            this.x = x || Math.random() * config.maxX;
            this.y = y || Math.random() * config.maxY;

            this.radius = config.minRadius + Math.random() * (config.maxRadius - config.minRadius);

            this.speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

            this.directionAngle = Math.floor(Math.random() * 360);
            this.direction = {
                x: Math.cos(this.directionAngle) * this.speed,
                y: Math.sin(this.directionAngle) * this.speed,
            };

            this.color = color || config.color;
        }

        update() {
            this.collision();

            this.x += this.direction.x;
            this.y += this.direction.y;
        }

        collision() {
            if (this.x >= config.maxX || this.x <= 0) {this.direction.x *= -1};
            if (this.y >= config.maxY || this.y <= 0) {this.direction.y *= -1};

            this.x = this.x > config.maxX ? config.maxX : this.x;
            this.y = this.y > config.maxY ? config.maxY : this.y;
            this.x = this.x < 0 ? 0 : this.x;
            this.y = this.y < 0 ? 0 : this.y;
        }

        render() {
            canvas.beginPath();
            canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            canvas.closePath();
            canvas.fillStyle = this.color;
            canvas.fill();
        }

        static checkDistance(elem1, elem2) {
            return Math.sqrt(Math.pow(elem1.x - elem2.x, 2) + Math.pow(elem1.y - elem2.y, 2));
        }
    }

    // Animation:
    function loop() {
        canvas.fillStyle = config.backgroundColor;
        canvas.fillRect(0, 0, config.maxX, config.maxY);

        for (let particle of particles) {
            particle.update();
            particle.render();
        }

        for (let particle of particles) {
            communicate(particle, particles);
        }

        window.requestAnimationFrame(loop);
    }

    // Communicate points:
    function communicate(point, father) {
        for (let i = 0; i < father.length; i++) {
            let distance = Particle.checkDistance(point, father[i]);
            let opacity = 1 - distance / config.communicationRadius;

            if (opacity > 0) {
                canvas.lineWidth = config.lineWidth;
                canvas.strokeStyle = config.lineColor.replace('govno', opacity);
                canvas.beginPath();
                canvas.moveTo(point.x, point.y);
                canvas.lineTo(father[i].x, father[i].y);
                canvas.closePath();
                canvas.stroke();
            }
        }
    }

    // Add new particle to particles[]:
    canvasBody.addEventListener('click', (e) => {
        particles.push(new Particle(e.pageX, e.pageY));
    });

    // Remove last particle from particles[]:
    canvasBody.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        particles.splice(particles.length - 1, 1);
    });

    // Initialization:
    (() => {
        for (let i = 0; i < config.initialAmount; i++) {
            particles.push(new Particle());
        }

        window.requestAnimationFrame(loop);
    })();
});