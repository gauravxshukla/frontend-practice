export const runAccordion = () => {
  function accordion($rootEl, { sections }) {
    function attachEvents() {
      console.log('attachEvents');
    }

    function init() {
      $rootEl.classList.add('accordion');
      //React fragment created here
      const $accordionSections = document.createDocumentFragment();

      sections.forEach(({ value, title, contents }) => {
        // Section created here
        const $accordionSection = document.createElement('div');
        $accordionSection.classList.add('accordion-item');

        // Title element created
        const $accordionTitleBtn = document.createElement('button');
        $accordionTitleBtn.classList.add('accordion-item-title');

        // Added button properties
        $accordionTitleBtn.type = 'button';
        $accordionTitleBtn.setAttribute('data-value', value);

        // Added icon in span
        const $accordionIcon = document.createElement('span');
        $accordionIcon.classList.add('accordion-icon');
        $accordionIcon.setAttribute('aria-hidden', 'true');

        // Title and icon appended here
        $accordionTitleBtn.append(title, $accordionIcon);

        // Content element created here
        const $accordionSectionContents = document.createElement('div');
        $accordionSectionContents.classList.add('accordion-item-contents');
        $accordionSectionContents.hidden = true;
        $accordionSectionContents.textContent = contents;

        // Content and header append to current Section
        $accordionSection.append($accordionTitleBtn, $accordionSectionContents);
        
        // Current section appended to all sections
        $accordionSections.append($accordionSection);
      });

      $rootEl.appendChild($accordionSections);
    }


    init();
    attachEvents();
  }

  accordion(document.getElementById('app'), {
    sections: [
      {
        value: 'html',
        title: 'HTML',
        contents:
          'The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.',
      },
      {
        value: 'css',
        title: 'CSS',
        contents:
          'Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.',
      },
      {
        value: 'javascript',
        title: 'JavaScript',
        contents:
          'JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.',
      },
    ],
  });
};
