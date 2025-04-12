// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Select the intro and content divs
  const elementsToAnimate = document.querySelectorAll(".intro, .content");

  // Add the 'hover-in' class to each element
  elementsToAnimate.forEach((element) => {
    element.classList.add("hover-in");
  });
});