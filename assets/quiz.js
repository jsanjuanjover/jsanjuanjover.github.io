// Interactive multiple-choice quizzes for blog posts.
//
// Markup, written in the post's .qmd:
//
//   ::: {.quiz}
//   **1.** Question text?
//
//   - Wrong option
//   - [Right option]{.correct}
//   - Wrong option
//
//   [Why the right option is right.]{.explanation}
//   :::
//
// Each option becomes a button. One click answers the question: the chosen
// option turns green or red, the right one is always revealed, and the
// explanation appears. Without JavaScript the quiz reads as a plain list.

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".quiz").forEach((quiz) => {
    const list = quiz.querySelector("ul");
    if (!list) return;

    const explanation = quiz.querySelector(".explanation");
    const explanationBlock = explanation ? explanation.closest("p") || explanation : null;
    if (explanationBlock) explanationBlock.hidden = true;

    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("aria-live", "polite");
    list.after(feedback);

    const buttons = [];
    list.classList.add("quiz-options");

    list.querySelectorAll(":scope > li").forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.dataset.correct = item.querySelector(".correct") ? "true" : "false";
      button.innerHTML = item.innerHTML;
      item.replaceChildren(button);
      buttons.push(button);
    });

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const right = button.dataset.correct === "true";

        buttons.forEach((b) => {
          b.disabled = true;
          if (b.dataset.correct === "true") b.classList.add("is-correct");
        });
        if (!right) button.classList.add("is-wrong");
        button.classList.add("is-chosen");

        feedback.textContent = right ? "Correct!" : "Not quite.";
        feedback.classList.add(right ? "is-correct" : "is-wrong");
        if (explanationBlock) explanationBlock.hidden = false;
      });
    });
  });
});
