const guidanceButton = document.querySelector("#guidance-button");
const guidanceMessage = document.querySelector("#guidance-message");

if (guidanceButton && guidanceMessage) {
  guidanceButton.addEventListener("click", () => {
    guidanceMessage.textContent =
      "Your request is marked for Merlin's council. Watch for the next sign.";
  });
}