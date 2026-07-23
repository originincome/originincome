# Origin Income V7 – Resend contact form

This version sends website contact requests to `hello@originincome.com` through Resend.

## Vercel setup

Create this Environment Variable in the Vercel project:

- Key: `RESEND_API_KEY`
- Value: your private Resend API key beginning with `re_`
- Environment: Production and Preview
- Sensitive: enabled

After saving, redeploy the project.

## Email flow

- Destination: `hello@originincome.com`
- Sender: `Origin Income Website <hello@originincome.com>`
- Reply-To: the visitor's email address
- Categories: General, Support, Billing, Privacy

The API key is never exposed to the browser. The email is sent server-side through `/api/contact`.
