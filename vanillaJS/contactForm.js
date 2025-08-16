export function contactForm(){
    const $rootEl = document.getElementById('app');
    $rootEl.classList.add('container');

    const $newForm = document.createElement('form');
    $newForm.classList.add('form-container');
    $newForm.innerHTML = 
    `
    <label for='name'>Name</label>
    <input type='text' name='name' required />
    <label for='email'>Email</label>
    <input type='email' name='email' required />
    <label for='message'>Message</label>
    <textarea name="message" placeholder="Enter your message here."></textarea>
    <input type="submit" value="Send" />
    `;

    $newForm.addEventListener('submit', () => {
        alert('Form submitted successfully');
    })

    $rootEl.appendChild($newForm);
}
