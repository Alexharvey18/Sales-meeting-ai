# Manual Netlify Deployment Instructions

Since there were permission issues with the Netlify CLI, follow these steps to deploy your Sales Meeting AI application manually:

## Quick Deployment

1. Go to [Netlify](https://app.netlify.com/)
2. Sign up or log in to your account
3. Go to the "Sites" section
4. Drag and drop the `salesmeetingai-deploy.zip` file onto the drag-and-drop area
5. Wait for the deployment to complete
6. Your site will be live at a randomly generated URL (e.g., `https://random-name-123456.netlify.app`)

## Custom Domain (Optional)

1. In your site's overview page, click "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to set up your custom domain

## Verification

1. Once deployed, visit your site URL
2. Try searching for a company (e.g., "Apple" or "Microsoft")
3. Verify all tabs load correctly and display appropriate information

## Troubleshooting

If the API functions aren't working:

1. Go to the "Functions" section in your Netlify dashboard
2. Check if the `api` function is listed
3. Check the function logs for any errors

If the application isn't loading correctly:

1. Go to the "Deploys" section
2. View the deployment logs for any errors
3. Try re-uploading the zip file

## Notes

- The application uses mock data by default, so no API keys are required
- The application is completely self-contained and should work immediately after deployment
- Netlify automatically handles all routing through the netlify.toml configuration 