# Implementation Plan - Integrate Twilio WhatsApp API

Automate order status notifications using the Twilio API for WhatsApp. Currently, when an administrator changes an order's status, the website opens a manual `wa.me` WhatsApp Web link for the admin to copy-paste and send the message manually. This plan automates the notification process via a new Express backend endpoint and the Twilio Node.js SDK.

## Proposed Changes

### Dependencies & Setup

#### [MODIFY] [package.json](file:///f:/data/pooja-store/package.json)
- Add `twilio` and `dotenv` to `dependencies`.

#### [MODIFY] [.env](file:///f:/data/pooja-store/.env)
- Add environment variables for Twilio configuration:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_WHATSAPP_NUMBER`

---

### Backend

#### [MODIFY] [server.js](file:///f:/data/pooja-store/server.js)
- Load environment variables using `dotenv`.
- Initialize the Twilio client using the credentials from `.env`.
- Add a new POST route at `/api/send-whatsapp` that:
  1. Accepts the destination phone number and the message body.
  2. Formats the phone number to standard international format (adds `91` country code if it is a 10-digit number).
  3. Sends the WhatsApp message using `twilioClient.messages.create()`.
  4. Returns a JSON response with status details.

---

### Frontend

#### [MODIFY] [admin.js](file:///f:/data/pooja-store/public/js/admin.js)
- In the function `triggerNotificationIfApplicable`, replace the logic that opens `wa.me` links with an asynchronous `fetch` request calling the new `/api/send-whatsapp` endpoint.
- Display a toast notification informing the admin whether the notification was dispatched successfully.

---

## Verification Plan

### Automated Verification
- Run local server using `npm run dev`.
- Use a mock payload or standard UI interaction to verify the `/api/send-whatsapp` endpoint returns 200/500 depending on credentials.

### Manual Verification
1. Add mock Twilio credentials to `.env`.
2. Open the Admin Panel, select an order, and update its status.
3. Confirm that the browser no longer attempts to open a new tab containing a manual WhatsApp link.
4. Verify that the backend prints appropriate logs/errors when attempting to send the message.
5. If valid Twilio credentials are used, confirm the receipt of a WhatsApp message on the customer's phone number.
