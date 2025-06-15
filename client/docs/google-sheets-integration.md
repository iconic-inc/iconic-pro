# Google Sheets Integration for Course Registration

This document explains how to set up Google Sheets integration for the course registration feature.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Sheets spreadsheet to store registration data

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable the Google Sheets API

### 2. Set Up Service Account Authentication

There are two authentication methods available:

#### Option A: Service Account (Recommended for server-side)

1. In your Google Cloud project, go to "IAM & Admin" > "Service Accounts"
2. Create a new service account
3. Grant the service account the "Editor" role for Google Sheets
4. Create and download a JSON key for the service account
5. From the JSON key, extract the `client_email` and `private_key` values

#### Option B: API Key (Read-only access)

1. In your Google Cloud project, go to "APIs & Services" > "Credentials"
2. Create an API key
3. Restrict the API key to only Google Sheets API

### 3. Configure Your Spreadsheet

1. Create a Google Sheets spreadsheet
2. Note the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
3. If using a service account, share the spreadsheet with the service account email address (giving it edit access)
4. Create a sheet named "Course Registrations" with the following columns:
   - Course
   - Name
   - Phone
   - Timestamp

### 4. Set Environment Variables

Add the following environment variables to your `.env` file:

```
DEV_GOOGLE_SHEET_ID=your_spreadsheet_id
DEV_GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
DEV_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
DEV_GOOGLE_API_KEY=your_api_key_here (optional)

# Similarly for production with PRO_ prefix
```

## Testing the Integration

After setting up, you can test the integration by submitting the course registration form. The data should appear in your Google Sheets spreadsheet.

## Troubleshooting

If you encounter issues:

1. Check that the service account has permission to access the spreadsheet
2. Verify that the correct spreadsheet ID is being used
3. Make sure the environment variables are properly set and loaded
4. Check server logs for any error messages related to Google Sheets API

## References

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Node.js Google API Client](https://github.com/googleapis/google-api-nodejs-client)
