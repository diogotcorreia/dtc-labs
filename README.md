# dtc-labs

## Available environment variables

```env
PORT=5000

TRITON_DB_HOST=localhost
TRITON_DB_PORT=3306
TRITON_DB_USERNAME=root
TRITON_DB_PASSWORD=
TRITON_DB_NAME=triton

PAYPAL_MODE=sandbox # 'sandbox' or 'live'
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

PAYPAL_SPREADSHEET_ID=
```

For [Google Sheets' API](https://console.developers.google.com/apis/credentials), a `credentials.json` file must be placed at the root of the project.

Before running it on PM2, it must be ran from the shell, since you need to type the resulting Google login token.
