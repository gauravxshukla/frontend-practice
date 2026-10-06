import "./styles.css";

function contactForm() {
  const $rootEl = document.getElementById("app");

  const $form = document.createElement("form");
  $form.classList.add("form-container");
  $form.innerHTML = `
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required />
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />
    <label for="message">Message</label>
    <textarea id="message" name="message" placeholder="Enter your message here." required></textarea>
    <button type="submit">Send</button>
  `;

  const $status = document.createElement("p");
  $status.setAttribute("role", "status");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData($form);
    $status.textContent = `Thanks ${data.get("name")}! We'll reply to ${data.get("email")}.`;
    $form.reset();
  });

  $rootEl.append($form, $status);
}

contactForm();
