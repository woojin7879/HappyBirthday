const letters = document.querySelectorAll(".letter");
const buttons = document.querySelectorAll(".button-container button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    if (targetId === "letter-all") {
      letters.forEach((letter) => {
        const hue = Math.floor(Math.random() * 360);
        if (letter !== document.getElementById("letter-heart")) {
          animateLetter(letter, hue, false);
        } else {
          animateLetter(letter, hue, true);
        }
      });
    } else {
      const letter = document.getElementById(targetId);
      if (letter) {
        const hue = Math.floor(Math.random() * 360);
        animateLetter(letter, hue, true);
      }
    }
  });
});

function playFireworkSound() {
  const fireworkSound = new Audio("sounds/firework.mp3");
  fireworkSound.currentTime = 0; // 시작 시간 설정 (초 단위)
  fireworkSound.play();

  //3초후 오디오 소리 fade out
  setTimeout(() => {
    let fadeInterval = setInterval(() => {
      if (fireworkSound.volume > 0.1) {
        fireworkSound.volume -= 0.1;
      } else {
        clearInterval(fadeInterval);
      }
    }, 100);
  }, 2000);

  // 4초 후에 오디오 정지
  setTimeout(() => {
    fireworkSound.pause();
    fireworkSound.currentTime = 0; // 오디오를 처음으로 되돌림
  }, 4000); // 1000 밀리초 = 1초
}

function animateLetter(letter, hue, playSound = true) {
  if (letter.dataset.animating === "true") return;

  letter.dataset.animating = "true";
  const rect = letter.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  const randomX = (Math.random() - 0.5) * 50;
  const randomY = -(Math.random() * 150 + 200);
  letter.style.setProperty("--random-x", `${randomX}px`);
  letter.style.setProperty("--random-y", `${randomY}px`);

  letter.style.color = `hsl(${hue}, 100%, 50%)`;

  letter.style.visibility = "visible";
  letter.classList.add("animating");

  if (playSound) {
    playFireworkSound();
  }

  letter.addEventListener(
    "animationend",
    function onAnimationEnd() {
      createParticles(startX + randomX, startY + randomY, hue);

      letter.classList.remove("animating");
      letter.style.transform = "none";
      letter.style.opacity = "1";
      letter.dataset.animating = "false";
      letter.style.removeProperty("--random-x");
      letter.style.removeProperty("--random-y");

      letter.style.visibility = "hidden";

      letter.removeEventListener("animationend", onAnimationEnd);
    },
    { once: true }
  );
}

function createParticles(x, y, hue) {
  const numParticles = 100;
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.setProperty("--hue", hue);

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 180 + 20;
    const translateX = Math.cos(angle) * distance + "px";
    const translateY = Math.sin(angle) * distance + "px";

    particle.style.setProperty("--x", translateX);
    particle.style.setProperty("--y", translateY);

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  }
}
