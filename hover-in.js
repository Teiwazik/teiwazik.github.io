document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(".intro, .content");

  elementsToAnimate.forEach((element) => {
    element.classList.add("hover-in");
  });
});