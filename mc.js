(function () {
    // Hàm tạo hiệu ứng lung linh (sparkle) cho các hạt
    function createSparkleEffect(element) {
        const sparkleDuration = 70; // Đơn vị: ms

        function randomOpacity() {
            element.style.opacity = Math.random();
        }

        // Hiệu ứng lặp lại
        setInterval(randomOpacity, sparkleDuration);
    }

    // Hàm tạo chuyển động và hiệu ứng hạt
    function animateParticles() {
        if (isAnimating) {
            let particle = particles[currentParticleIndex];

            // Thiết lập vị trí ban đầu của hạt
            const containerX = pContainer.getBoundingClientRect().x;
            const containerY = pContainer.getBoundingClientRect().y;
            const scale = randomScale();

            particle.style.transform = `translate(${containerX}px, ${containerY}px) scale(${scale})`;

            // Tạo hiệu ứng chuyển động
            const velocityX = (Math.random() * 46 - 23); // [-23, 23]
            const velocityY = (Math.random() * 46 - 23); // [-23, 23]
            const gravity = (Math.random() * 56 - 6); // [-6, 50]
            const rotation = (Math.random() * 483 - 123); // [-123, 360]

            let animationDuration = Math.random() * (6 - 0.61) + 0.61; // [0.61, 6] giây

            particle.style.transition = `transform ${animationDuration}s linear`;
            particle.style.transform += ` translate(${velocityX}px, ${velocityY + gravity}px) rotate(${rotation}deg) scale(0)`;

            createSparkleEffect(particle);

            currentParticleIndex++;
            currentParticleIndex = (currentParticleIndex >= 201) ? 0 : currentParticleIndex;
        }
    }

    // Khởi tạo DOM và dữ liệu
    const svgElement = document.querySelector(".mainSVG");
    const pContainer = document.querySelector(".pContainer");
    const particles = [];
    const colors = "#E8F6F8 #ACE8F8 #F6FBFE #A2CBDC #B74551 #5DBA72 #910B28 #446D39".split(" ");
    const shapes = ["#star", "#circ", "#cross", "#heart"];
    let currentParticleIndex = 0;
    let isAnimating = true;

    // Hàm random scale
    const randomScale = () => (Math.random() * (3 - 0.5) + 0.5).toFixed(3);

    // Tạo các hạt và đặt trong SVG
    for (let i = 0; i < 201; i++) {
        let shapeIndex = i % shapes.length;
        let colorIndex = i % colors.length;

        let particle = document.querySelector(shapes[shapeIndex]).cloneNode(true);
        svgElement.appendChild(particle);
        particle.setAttribute("fill", colors[colorIndex]);
        particle.setAttribute("class", "particle");

        // Đặt vị trí ban đầu của hạt
        particle.style.position = "absolute";
        particle.style.transform = "translate(-100px, -100px) scale(1)";
        particles.push(particle);
    }

    // Tạo chuyển động chính
    function animateMainTimeline() {
        const treePath = document.querySelector(".treePath");
        const treeBottomPath = document.querySelector(".treeBottomPath");

        const pathLength = treePath.getTotalLength();
        let startTime = null;

        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = (time - startTime) / 1000; // Đổi sang giây

            if (elapsed <= 6) {
                const progress = elapsed / 6;
                const point = treePath.getPointAtLength(progress * pathLength);
                pContainer.style.transform = `translate(${point.x}px, ${point.y}px)`;
                requestAnimationFrame(animate);
            } else {
                isAnimating = false;
                // Chuyển động theo treeBottomPath
                const bottomPathLength = treeBottomPath.getTotalLength();
                startTime = null;

                function animateBottom(time) {
                    if (!startTime) startTime = time;
                    const elapsedBottom = (time - startTime) / 1000;

                    if (elapsedBottom <= 2) {
                        const progressBottom = elapsedBottom / 2;
                        const pointBottom = treeBottomPath.getPointAtLength(progressBottom * bottomPathLength);
                        pContainer.style.transform = `translate(${pointBottom.x}px, ${pointBottom.y}px)`;
                        requestAnimationFrame(animateBottom);
                    } else {
                        isAnimating = true;
                    }
                }

                requestAnimationFrame(animateBottom);
            }
        }

        requestAnimationFrame(animate);
    }

    animateMainTimeline();
})();
