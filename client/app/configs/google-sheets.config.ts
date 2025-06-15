import { google } from 'googleapis';

// Environment prefix based on NODE_ENV
const envPrefix = process.env.NODE_ENV === 'production' ? 'PRO_' : 'DEV_';

// Load credentials from environment variables with proper prefix
const credentials = {
  client_email: process.env[`${envPrefix}GOOGLE_SERVICE_ACCOUNT_EMAIL`] || '',
  private_key: (
    process.env[`${envPrefix}GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`] || ''
  ).replace(/\\n/g, '\n'),
  // If using API key instead of service account
  api_key: process.env[`${envPrefix}GOOGLE_API_KEY`] || '',
};

// The ID of your Google Sheet (from the URL)
export const SPREADSHEET_ID = process.env[`${envPrefix}GOOGLE_SHEET_ID`] || '';

// The sheet name or gid within the spreadsheet
export const SHEET_NAME = 'Sheet1';

// Initialize the sheets API
export const getGoogleSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

// Alternative method using API key (read-only)
export const getReadOnlySheetsClient = () => {
  return google.sheets({
    version: 'v4',
    auth: credentials.api_key,
  });
};

// Function to append data to a Google Sheet
export const appendToSheet = async (values: string[][]) => {
  try {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:D`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw error;
  }
};

// Function to read data from a Google Sheet
export const readFromSheet = async (range: string) => {
  try {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${range}`,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error reading from Google Sheet:', error);
    throw error;
  }
};
