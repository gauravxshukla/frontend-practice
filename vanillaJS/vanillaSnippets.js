// Vanilla JS Snippets


/* 1. Element Creation & Insertion */
/*
   let newEl = document.createElement('h5');
   newEl.innerHTML = 'Created an Element using document.createElement() and appended it to the DOM using appendChild().';
   document.getElementById('app').appendChild(newEl);
*/

/* 2. DOM Manipulation (Essential) */

/*
   
   let currentRoot = document.getElementById('app');
   currentRoot.innerHTML = 'Element Selected using document.getElementById() and modified its innerHTML.';
   let newEl = document.createElement('p');
   newEl.innerHTML = 'Hello World';
   currentRoot.appendChild(newEl);

   newEl = document.querySelector('p');
   newEl.innerHTML = 'Element Selected using document.querySelector() and modified its innerHTML.';
   currentRoot.appendChild(newEl);

   newEl = document.createElement('h3');
   newEl.innerHTML = 'Hello World';
   currentRoot.appendChild(newEl);
   newEl = document.querySelectorAll('h3');
   newEl[0].innerHTML = 'Element Selected using document.querySelectorAll() and modified its innerHTML.';
   currentRoot.appendChild(newEl);

*/

/* 3. Event Handling (Essential) */

//    let newEl = document.createElement('button');
//    newEl.innerHTML = 'Click me';
//    document.getElementById('app').appendChild(newEl);



//    newEl.addEventListener('click', () => {
//       newEl.innerHTML = 'Button Clicked';
//    });

//    newEl.removeEventListener('click', () => {
//       newEl.innerHTML = 'Button Clicked';
//    });

/*

Content Manipulation
element.innerHTML
element.textContent

Attribute Manipulation

element.getAttribute(name)
element.setAttribute(name, value)

Class Manipulation

element.classList.add(className)
element.classList.remove(className)
element.classList.toggle(className)

Style Manipulation

element.style.property

Element Removal

element.remove()

Event Handling (Essential)
Event Registration

element.addEventListener(event, handler)
element.removeEventListener(event, handler)

Event Object

event.preventDefault()
event.target

Common Events

click
submit
change
input
load
keydown
*/