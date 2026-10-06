---
title: Contact Form
type: vanilla
difficulty: easy
tags: [forms, dom, accessibility]
estimatedMinutes: 15
---

Build a contact form with **Name**, **Email** and **Message** fields and a **Send** button.

- Every field has a visible `<label>` that's properly associated with its control.
- All fields are required, and email must be a valid address. Use built-in HTML validation.
- On submit, don't reload the page. Show a confirmation that includes the submitted name and email, and reset the form.

## Notes

- `<label for="x">` needs a matching `id="x"`. Matching `name` alone doesn't associate it. (The original `contactForm.js` had `for` without `id`; `basics.js` got it right. The reference merges the two.)
- `type="email"` plus `required` gives you validation for free. The submit event only fires once the form is valid.
- `e.preventDefault()` stops the navigation. `new FormData(form)` reads all fields at once.
- Show the confirmation in the DOM (with `role="status"`) rather than with `alert()`, which blocks and is unfriendly to screen readers.
- Follow-up: POST to an endpoint with `fetch`, with loading and error states.
