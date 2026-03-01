const qrcode = require('qrcode');
const nodemailer = require('nodemailer');

/**
 * Sends an order confirmation email to the user with an embedded QR code.
 * Fails silently so it does not block the main application flow.
 */
const sendOrderConfirmationEmail = async (user, orderId, items, totalAmount, qrString) => {
    console.log('--- sendOrderConfirmationEmail INVOKED ---');
    console.log('user:', user.email, 'orderId:', orderId);

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('No email service configured (Gmail). Skipping email sending.');
            return;
        }

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
            const priceFormatted = Number(item.price).toFixed(2);
            itemsHtml += `
                    <tr>
                        <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name || 'Unknown Product'}</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">${item.quantity}</td>
                        <td style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">₹${priceFormatted}</td>
                    </tr>
            `;
        });

        itemsHtml += `
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="2" style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">Total Amount</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: right;">₹${Number(totalAmount).toFixed(2)}</th>
                    </tr>
                </tfoot>
            </table>
        `;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background-color: #059669; padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Order Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Thank you for shopping with Smart Inventory</p>
                </div>

                <div style="padding: 30px;">
                    <h2 style="color: #0f172a; margin-top: 0;">Hello ${user.name || 'Customer'},</h2>
                    <p style="line-height: 1.6; color: #475569;">Your order has been placed successfully. Below are your order details and a QR code for quick verification at the store.</p>
                    
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #dcfce7; margin: 25px 0; text-align: center;">
                        <p style="margin: 0; color: #166534; text-transform: uppercase; font-size: 12px; font-weight: 700; letter-spacing: 0.05em;">Order ID</p>
                        <h3 style="margin: 5px 0; color: #065f46; font-size: 20px; font-family: monospace;">${orderId}</h3>
                        <p style="margin: 5px 0 0 0; color: #166534; font-size: 13px; opacity: 0.8;">Placed on: ${new Date().toLocaleString()}</p>
                    </div>

                    <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
                    ${itemsHtml}

                    <div style="text-align: center; margin-top: 40px; padding: 30px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; color: #0f172a;">Identity QR Code</h3>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Please present this code to the store administrator for order pickup or verification.</p>
                        <div style="background: white; padding: 15px; display: inline-block; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                            <img src="cid:qrcode" alt="Order QR Code" style="width: 200px; height: 200px; display: block;" />
                        </div>
                    </div>

                    <div style="margin-top: 40px; padding: 20px; border-radius: 12px; background-color: #fff7ed; border: 1px solid #ffedd5; text-align: center;">
                        <p style="margin: 0; color: #9a3412; font-size: 14px;"><strong>Note:</strong> Do not share this QR code with anyone else.</p>
                    </div>
                </div>

                <div style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
                    <p style="margin: 0 0 10px 0;">Questions? Contact us at support@smartinventory.com</p>
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Smart Inventory. All rights reserved.</p>
                </div>
            </div>
        `;

        console.log('Using Nodemailer (Gmail)...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Smart Inventory" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Order Confirmed: #${orderId}`,
            html: emailHtml,
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: qrImageBase64.split("base64,")[1],
                    encoding: 'base64',
                    cid: 'qrcode'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent successfully to ${user.email}`);

    } catch (error) {
        console.error('Error sending order confirmation email:', error.message);
    }
};

module.exports = {
    sendOrderConfirmationEmail
};
