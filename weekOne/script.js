const guidanceButton = document.querySelector("#guidance-button");
const guidanceMessage = document.querySelector("#guidance-message");
const magicBurst = document.querySelector("#magic-burst");

const sparkColors = ["#f0d995", "#9fb79f", "#b96f52", "#f5efd9"];

function castMagicBurst() {
  if (!magicBurst) {
    return;
  }

  magicBurst.replaceChildren();
  magicBurst.classList.remove("is-casting");
  void magicBurst.offsetWidth;
  magicBurst.classList.add("is-casting");

  for (let index = 0; index < 42; index += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 42;
    const distance = 90 + Math.random() * 280;

    spark.className = "magic-spark";
    spark.style.setProperty("--spark-x", "50vw");
    spark.style.setProperty("--spark-y", "52vh");
    spark.style.setProperty("--spark-dx", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--spark-dy", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--spark-size", `${6 + Math.random() * 10}px`);
    spark.style.setProperty(
      "--spark-color",
      sparkColors[index % sparkColors.length],
    );

    magicBurst.append(spark);
  }

  window.setTimeout(() => {
    magicBurst.classList.remove("is-casting");
    magicBurst.replaceChildren();
  }, 950);
}

if (guidanceButton && guidanceMessage) {
  guidanceButton.addEventListener("click", () => {
    castMagicBurst();
    guidanceMessage.textContent = "Yes. Merlin felt that one.";
  });
}