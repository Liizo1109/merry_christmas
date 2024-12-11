(function () {
    // Hàm tạo hiệu ứng lung linh (sparkle) cho các hạt
    function createSparkleEffect(element) {
        gsap.killTweensOf(element, { opacity: true });
        gsap.fromTo(element, { opacity: 1 }, {
            duration: 0.07,
            opacity: Math.random(),
            repeat: -1
        });
    }

    // Hàm tạo chuyển động và hiệu ứng hạt
    function animateParticles() {
        if (isAnimating) {
            let particle = particles[currentParticleIndex];
            gsap.set(particle, {
                x: gsap.getProperty(".pContainer", "x"),
                y: gsap.getProperty(".pContainer", "y"),
                scale: randomScale()
            });

            // Tạo timeline cho hiệu ứng hạt
            gsap.timeline()
                .to(particle, {
                    duration: gsap.utils.random(0.61, 6),
                    physics2D: {
                        velocity: gsap.utils.random(-23, 23),
                        angle: gsap.utils.random(-180, 180),
                        gravity: gsap.utils.random(-6, 50)
                    },
                    scale: 0,
                    rotation: gsap.utils.random(-123, 360),
                    ease: "power1",
                    onStart: createSparkleEffect,
                    onStartParams: [particle]
                });

            currentParticleIndex++;
            currentParticleIndex = (currentParticleIndex >= 201) ? 0 : currentParticleIndex;
        }
    }

    // Khởi tạo các plugin và DOM
    MorphSVGPlugin.convertToPath("polygon");
    const svgElement = document.querySelector(".mainSVG");
    const particles = [];
    const colors = "#E8F6F8 #ACE8F8 #F6FBFE #A2CBDC #B74551 #5DBA72 #910B28 #446D39".split(" ");
    const shapes = ["#star", "#circ", "#cross", "#heart"];
    let currentParticleIndex = 0;
    let isAnimating = true;

    // Hàm random scale
    const randomScale = gsap.utils.random(0.5, 3, 0.001, true);

    // Tạo các hạt và đặt trong SVG
    for (let i = 0; i < 201; i++) {
        let particle = document.querySelector(shapes[i % shapes.length]).cloneNode(true);
        svgElement.appendChild(particle);
        particle.setAttribute("fill", colors[i % colors.length]);
        particle.setAttribute("class", "particle");
        particles.push(particle);
        gsap.set(particle, { x: -100, y: -100, transformOrigin: "50% 50%" });
    }

    // Tạo chuyển động chính
    const mainTimeline = gsap.timeline({
        onUpdate: animateParticles
    });

    mainTimeline
        .to(".pContainer, .sparkle", {
            duration: 6,
            motionPath: { path: ".treePath", autoRotate: false },
            ease: "linear"
        })
        .to(".pContainer, .sparkle", {
            duration: 1,
            onStart: () => { isAnimating = false; },
            x: treeBottomPath[0].x,
            y: treeBottomPath[0].y
        })
        .to(".pContainer, .sparkle", {
            duration: 2,
            onStart: () => { isAnimating = true; },
            motionPath: { path: ".treeBottomPath", autoRotate: false },
            ease: "linear"
        }, "-=0");

    gsap.globalTimeline.timeScale(1.5);
    mainTimeline.vars.onComplete = function () {
        gsap.to('foreignObject', { opacity: 1 });
    };
})();
