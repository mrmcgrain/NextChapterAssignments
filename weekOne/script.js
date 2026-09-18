const guidanceButton = document.querySelector("#guidance-button");
const guidanceMessage = document.querySelector("#guidance-message");
const magicBurst = document.querySelector("#magic-burst");

const sparkColors = ["#f0d995", "#9fb79f", "#b96f52", "#f5efd9", "#ffffff"];

function castMagicBurst() {
  if (!magicBurst) {
    return;
  }

  const buttonBox = guidanceButton.getBoundingClientRect();
  const originX = buttonBox.left + buttonBox.width / 2;
  const originY = buttonBox.top + buttonBox.height / 2;

  magicBurst.replaceChildren();
  magicBurst.classList.remove("is-casting");
  document.body.classList.remove("is-shaking");
  void magicBurst.offsetWidth;
  magicBurst.classList.add("is-casting");
  document.body.classList.add("is-shaking");

  for (let index = 0; index < 140; index += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 140 + Math.random() * 0.28;
    const distance = 180 + Math.random() * 860;

    spark.className = "magic-spark";
    spark.style.setProperty("--spark-x", `${originX}px`);
    spark.style.setProperty("--spark-y", `${originY}px`);
    spark.style.setProperty("--spark-dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--spark-dy", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--spark-size", `${8 + Math.random() * 22}px`);
    spark.style.setProperty(
      "--spark-color",
      sparkColors[index % sparkColors.length],
    );

    magicBurst.append(spark);
  }

  window.setTimeout(() => {
    magicBurst.classList.remove("is-casting");
    magicBurst.replaceChildren();
    document.body.classList.remove("is-shaking");
  }, 1800);
}

if (guidanceButton && guidanceMessage) {
  guidanceButton.addEventListener("click", () => {
    castMagicBurst();
    guidanceMessage.textContent = "YES. That was aggressively magical.";
  });
}