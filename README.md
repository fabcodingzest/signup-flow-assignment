# Signup Flow

A multi-step signup flow built as a frontend assignment.

**Live demo:** https://fabsignup.netlify.app/

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- React Hook Form + Yup
- React Router DOM

## Running Locally

```bash
# via npm
npm install
npm run dev

# via yarn
yarn
yarn dev
```


## Project Structure

```
App.tsx
index.css
src/
├── components/     # Step components and shared UI
├── config/         # Step configuration
├── pages/          # Route-level page components
├── types/          # TypeScript types
├── utils/          # Form field utilities and mock API
├──validation/     # Yup schema
├── utils/          # Form field utilities and mock API
└── validation/     # Yup schema
```

## Notes

- Validation fires on blur, then revalidates live on change once a field has been touched — intentional UX decision to avoid showing errors while the user is still typing
- OTP inputs handle paste, backspace navigation, and replace-on-type
- Basic routing to redirect to `/dashboard' route
