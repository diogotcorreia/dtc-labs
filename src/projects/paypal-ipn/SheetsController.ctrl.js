import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

class SheetsController {
  constructor() {
    this.updateAuth = this.updateAuth.bind(this);
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Sheets API.
      this.authorize(JSON.parse(content), this.updateAuth);
    });
  }

  updateAuth(auth) {
    this.auth = auth;
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return this.getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  pad(number) {
    return ('0' + number).slice(-2);
  }

  handleTritonPurchase({ date, spigotUser, total, fee, currency, transactionId, marketplace }) {
    const sheets = google.sheets({ version: 'v4', auth: this.auth });
    const spreadsheetId = process.env.PAYPAL_SPREADSHEET_ID;
    sheets.spreadsheets.values.get(
      {
        spreadsheetId,
        range: 'Triton Purchases!H7:H',
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (!rows.every((v) => v[0] !== transactionId)) return;
        sheets.spreadsheets.values.append(
          {
            spreadsheetId,
            range: 'Triton Purchases!A7:A',
            valueInputOption: 'USER_ENTERED',
            resource: {
              values: [
                [
                  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
                  ``,
                  spigotUser,
                  total,
                  fee,
                  '',
                  '',
                  transactionId,
                  marketplace,
                  currency,
                ],
              ],
            },
          },
          (err) => {
            if (err) return console.log('Error while appending rows: ' + err);
            console.log('Added new purchase entry to Triton spreadsheet: ', spigotUser);
          }
        );
      }
    );
  }
}

export default SheetsController;
