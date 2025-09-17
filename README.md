# Park Seva

## Local development

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment

Create a `.env` file in the project root with:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_ENABLE_DEMO_ADMIN=true
VITE_ENABLE_SEED=true
```

For the Supabase Edge Function `create-payment-intent`, configure the secret in Supabase or local dev env:

- `STRIPE_SECRET_KEY=sk_test_...`

For the Supabase Edge Function `send-sms` (Twilio), configure the secrets:

- `TWILIO_ACCOUNT_SID=AC...`
- `TWILIO_AUTH_TOKEN=...`
- `TWILIO_PHONE=+1...`

Deploy/update functions with Supabase CLI:

```sh
supabase functions deploy create-payment-intent
supabase functions deploy send-sms
supabase secrets set --env-file supabase/.env
```

## Deployment

Deploy to your preferred hosting (Netlify, Vercel, etc.).
