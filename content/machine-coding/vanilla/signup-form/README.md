---
title: Signup Form
type: vanilla
difficulty: medium
tags: [forms, validation, accessibility]
estimatedMinutes: 30
---

Build a signup form with **Username**, **Email**, **Password** and **Confirm password**.

- Username: 4–20 characters, letters/numbers/underscore only.
- Email: a valid address.
- Password: at least 8 characters, including at least one number and one letter.
- Confirm password: must match.
- Validate each field on blur and on submit. Show an error message under the field, and connect it with `aria-describedby`.
- Disable the submit button while any field is invalid. On success, show a confirmation instead of the form.
