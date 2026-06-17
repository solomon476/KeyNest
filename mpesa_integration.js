/**
 * KeyNest - M-Pesa Daraja STK Push Integration Snippet
 * 
 * This snippet demonstrates how to initiate an STK Push and handle the webhook callback 
 * using Node.js and Express. It requires the 'axios' package.
 */

const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Environment variables (replace with actual process.env variables in production)
const CONSUMER_KEY = 'YOUR_CONSUMER_KEY';
const CONSUMER_SECRET = 'YOUR_CONSUMER_SECRET';
const SHORTCODE = 'YOUR_SHORTCODE';
const PASSKEY = 'YOUR_PASSKEY';
const CALLBACK_URL = 'https://your-domain.com/api/mpesa/callback';

/**
 * Middleware to generate M-Pesa Access Token
 */
async function generateAccessToken(req, res, next) {
    try {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: { Authorization: `Basic ${auth}` },
            }
        );
        req.mpesaToken = response.data.access_token;
        next();
    } catch (error) {
        console.error('Error generating M-Pesa token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to authenticate with M-Pesa' });
    }
}

/**
 * Route: Initiate STK Push (Tenant Pays Rent)
 */
app.post('/api/mpesa/stkpush', generateAccessToken, async (req, res) => {
    const { phoneNumber, amount, accountReference } = req.body;
    
    // Validate inputs
    if (!phoneNumber || !amount || !accountReference) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const token = req.mpesaToken;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // YYYYMMDDHHmmss
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber, // Tenant's phone number (e.g., 254712345678)
                PartyB: SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: CALLBACK_URL,
                AccountReference: accountReference, // e.g., Unit Number or Lease ID
                TransactionDesc: 'Rent Payment',
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Safaricom returns a CheckoutRequestID which we should save in our DB 
        // with a 'pending' status to match it later with the callback
        res.status(200).json({
            message: 'STK Push sent successfully',
            data: response.data,
        });

    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to initiate STK Push' });
    }
});

/**
 * Route: Handle Webhook Callback
 * Safaricom sends the transaction results here asynchronously.
 */
app.post('/api/mpesa/callback', async (req, res) => {
    console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

    const callbackData = req.body.Body.stkCallback;
    const resultCode = callbackData.ResultCode;
    const checkoutRequestID = callbackData.CheckoutRequestID;

    if (resultCode === 0) {
        // Transaction Successful
        const items = callbackData.CallbackMetadata.Item;
        let mpesaReceiptNumber = '';
        let amountPaid = 0;
        let phoneNumber = '';

        items.forEach((item) => {
            if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
            if (item.Name === 'Amount') amountPaid = item.Value;
            if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
        });

        console.log(`Success: Received KES ${amountPaid} from ${phoneNumber}. Receipt: ${mpesaReceiptNumber}`);
        
        // TODO: Update the 'payments' table in your database
        // UPDATE payments SET status = 'completed', mpesa_receipt_number = ?, amount = ? WHERE checkout_request_id = ?

    } else {
        // Transaction Failed (e.g., cancelled by user, insufficient funds)
        console.log(`Failed: CheckoutRequestID ${checkoutRequestID}. Reason: ${callbackData.ResultDesc}`);
        
        // TODO: Update the 'payments' table in your database to 'failed'
    }

    // Always respond with 200 OK so Safaricom knows we received the callback
    res.status(200).json({ message: 'Callback received successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`KeyNest Backend running on port ${PORT}`);
});
