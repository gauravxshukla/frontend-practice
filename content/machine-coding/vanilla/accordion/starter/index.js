import "./styles.css";

const SECTIONS = [
  {
    value: "html",
    title: "HTML",
    contents:
      "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.",
  },
  {
    value: "css",
    title: "CSS",
    contents:
      "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.",
  },
  {
    value: "javascript",
    title: "JavaScript",
    contents:
      "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
  },
];

function accordion($rootEl, { sections }) {
  function init() {
    $rootEl.classList.add("accordion");
    const $accordionSections = document.createDocumentFragment();

    sections.forEach(({ value, title, contents }) => {
      const $accordionSection = document.createElement("div");
      $accordionSection.classList.add("accordion-item");

      const $accordionTitleBtn = document.createElement("button");
      $accordionTitleBtn.classList.add("accordion-item-title");
      $accordionTitleBtn.type = "button";
      $accordionTitleBtn.setAttribute("data-value", value);
      $accordionTitleBtn.setAttribute("aria-expanded", "false");

      const $accordionIcon = document.createElement("span");
      $accordionIcon.classList.add("accordion-icon");
      $accordionIcon.setAttribute("aria-hidden", "true");

      $accordionTitleBtn.append(title, $accordionIcon);

      const $accordionSectionContents = document.createElement("div");
      $accordionSectionContents.classList.add("accordion-item-contents");
      $accordionSectionContents.hidden = true;
      $accordionSectionContents.textContent = contents;

      $accordionSection.append($accordionTitleBtn, $accordionSectionContents);
      $accordionSections.append($accordionSection);
    });

    $rootEl.appendChild($accordionSections);
  }

  function attachEvents() {
    // Toggle sections open/closed here.
  }

  init();
  attachEvents();
}

accordion(document.getElementById("app"), { sections: SECTIONS });
