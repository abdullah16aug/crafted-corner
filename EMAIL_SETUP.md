# Email Setup with Brevo

This document provides instructions for setting up email notifications for orders using Brevo (formerly SendinBlue).

## Setup Instructions

1. Create a Brevo account at [https://www.brevo.com/](https://www.brevo.com/)

2. Get your API key:

   - Log in to your Brevo account
   - Go to Settings → API Keys & Webhooks
   - Copy your API key (or create a new one if needed)

3. Add the API key to your environment variables:

   - Create a `.env.local` file in the project root if it doesn't exist
   - Add the following line:

   ```
   BREVO_API_KEY=your_brevo_api_key_here
   ```

4. Uncomment the email sending code in `src/app/api/orders/route.ts`
   - Find the commented code in the `sendOrderConfirmationEmail` function
   - Remove the comment marks `/*` and `*/` to enable the email sending functionality

## Testing

You can test the email functionality by:

1. Placing a test order on your site
2. Checking the console logs to see if the email was sent successfully
3. Verifying that the email was received at the specified address

## Troubleshooting

If emails are not being sent:

1. Check that your API key is correct
2. Verify that you have uncommented the email sending code
3. Look for error messages in the server logs
4. Check your Brevo dashboard for any sending limits or issues

## Additional Configuration

You can customize the email template in the `sendOrderConfirmationEmail` function in `src/app/api/orders/route.ts`.

For more advanced features, refer to the [Brevo API documentation](https://developers.brevo.com/docs).
