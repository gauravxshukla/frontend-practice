export function basicUI(){
    const $rootEl = document.getElementById('app');
    $rootEl.classList.add('container');

    const $newForm = document.createElement('form');
    $newForm.style.display = 'flex';
    $newForm.style.flexDirection = 'column';
    $newForm.style.gap = '10px';
    $newForm.style.width = '300px';
    $newForm.style.margin = '0 auto';

    $newForm.innerHTML = 
    `
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
        <button type="submit">Send</button>
    `;

    $newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const $name = document.getElementById('name');
        const $email = document.getElementById('email');
        const $message = document.getElementById('message');
        alert(`Name: ${$name.value}, Email: ${$email.value}, Message: ${$message.value}`);
    });



    $rootEl.appendChild($newForm);
    
    
}