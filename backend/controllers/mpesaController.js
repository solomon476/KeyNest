const axios = require('axios');
const db = require('../config/db');

// Middleware to generate M-Pesa token
exports.generateAccessToken = async (req, res, next) => {
    try {
        const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            { headers: { Authorization: `Basic ${auth}` } }
        );
        req.mpesaToken = response.data.access_token;
        next();
    } catch (error) {
        console.error('Error generating M-Pesa token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to authenticate with M-Pesa' });
    }
};

// Initiate STK Push
exports.stkPush = async (req, res) => {
    const { phoneNumber, amount, accountReference } = req.body;
    
    if (!phoneNumber || !amount || !accountReference) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const token = req.mpesaToken;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    
    const date = new Date();
    const timestamp = date.getFullYear().toString() + 
               (date.getMonth()+1).toString().padStart(2, '0') + 
               date.getDate().toString().padStart(2, '0') + 
               date.getHours().toString().padStart(2, '0') + 
               date.getMinutes().toString().padStart(2, '0') + 
               date.getSeconds().toString().padStart(2, '0');

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: shortcode,
                PhoneNumber: phoneNumber,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: accountReference,
                TransactionDesc: 'Rent Payment',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // TODO: Save response.data.CheckoutRequestID to DB to track this payment
        res.status(200).json({
            message: 'STK Push sent successfully',
            data: response.data,
        });
    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to initiate STK Push' });
    }
};

// Handle Webhook Callback
exports.callback = async (req, res) => {
    console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

    const callbackData = req.body?.Body?.stkCallback;
    if (!callbackData) return res.status(400).json({ error: 'Invalid callback data' });

    const resultCode = callbackData.ResultCode;
    const checkoutRequestID = callbackData.CheckoutRequestID;

    if (resultCode === 0) {
        const items = callbackData.CallbackMetadata.Item;
        let mpesaReceiptNumber = '';
        let amountPaid = 0;
        let phoneNumber = '';

        items.forEach((item) => {
            if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
            if (item.Name === 'Amount') amountPaid = item.Value;
            if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
        });

        console.log(`Success: KES ${amountPaid} from ${phoneNumber}. Ref: ${mpesaReceiptNumber}`);
        // TODO: Update database status using db.query()
        
    } else {
        console.log(`Failed: CheckoutRequestID ${checkoutRequestID}. Reason: ${callbackData.ResultDesc}`);
    }

    res.status(200).json({ message: 'Callback received successfully' });
};
