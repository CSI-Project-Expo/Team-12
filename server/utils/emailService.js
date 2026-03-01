const nodemailer = require('nodemailer');
const qrcode = require('qrcode');

/**
 * Sends an order confirmation email to the user with an embedded QR code.
 * Fails silently so it does not block the main application flow.
 *
 * @param {Object} user - The authenticated user object (from req.user)
 * @param {String} orderId - The created sale/order ID
 * @param {Array} items - Array of items with { name, quantity, price }
 * @param {Number} totalAmount - Total amount for the order
 * @param {String} qrString - The unique QR string generated for the bill
 */
const sendOrderConfirmationEmail = async (user, orderId, items, totalAmount, qrString) => {
    console.log('--- sendOrderConfirmationEmail INVOKED ---');
    console.log('user:', user.email, 'orderId:', orderId);
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email credentials (EMAIL_USER, EMAIL_PASS) not found in .env. Skipping email sending.');
            return;
        }

        console.log('Using credentials:', process.env.EMAIL_USER, 'PASS set:', !!process.env.EMAIL_PASS);

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use 'gmail' or configure host/port for your specific provider
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Generate QR code as Base64 image
        const qrImageBase64 = await qrcode.toDataURL(qrString, {
            errorCorrectionLevel: 'M',
            margin: 4,
            width: 300,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // Build HTML for items
        let itemsHtml = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Item</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">Qty</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
        `;

        items.forEach(item => {
            // Ensuring we output 2 decimals if price exists
            const priceFormatted = Number(item.price).toFixed(2);
            itemsHtml += `
                    <tr>
                        <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name || 'Unknown Product'}</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">${item.quantity}</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">$${priceFormatted}</td>
                    </tr>
            `;
        });

        itemsHtml += `
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="2" style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Total Amount</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">$${Number(totalAmount).toFixed(2)}</th>
                    </tr>
                </tfoot>
            </table>
        `;

        const mailOptions = {
            from: `"Smart Inventory" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Order Confirmation - #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2>Hello ${user.name || 'Customer'},</h2>
                    <p>Thank you for your purchase! We are pleased to confirm that your order has been placed successfully.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #0056b3;">Order ID: ${orderId}</h3>
                        <p style="margin: 0; color: #666;">Placed on: ${new Date().toLocaleString()}</p>
                    </div>

                    <h3>Order Summary</h3>
                    ${itemsHtml}

                    <div style="text-align: center; margin-top: 30px;">
                        <h3>Your Order QR Code</h3>
                        <p style="color: #666; font-size: 14px;">Show this QR code at the store for quick verification.</p>
                        <img src="cid:qrcode" alt="Order QR Code" style="max-width: 200px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;" />
                    </div>

                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    
                    <div style="text-align: center; color: #888; font-size: 12px;">
                        <p>If you have any questions, please contact our support team at support@smartinventory.com.</p>
                        <p>&copy; ${new Date().getFullYear()} Smart Inventory. All rights reserved.</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: qrImageBase64.split("base64,")[1],
                    encoding: 'base64',
                    cid: 'qrcode' // same cid value as in the html img src
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${user.email}`);

    } catch (error) {
        console.error('Error sending order confirmation email:', error.message);
        // Do not rethrow the error to prevent blocking the order process
    }
};

module.exports = {
    sendOrderConfirmationEmail
};
