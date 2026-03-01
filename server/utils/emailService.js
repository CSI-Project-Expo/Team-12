const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

/**
 * Sends an order confirmation email to the user with an embedded QR code.
 * Fails silently so it does not block the main application flow.
 */
const sendOrderConfirmationEmail = async (user, orderId, items, totalAmount, qrString) => {
    console.log('--- sendOrderConfirmationEmail INVOKED ---');
    console.log('user:', user.email, 'orderId:', orderId);
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        const useResend = resendApiKey && resendApiKey !== 're_your_api_key_here';
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        if (!useResend && (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)) {
            console.log('No email service configured (Resend or Gmail). Skipping email sending.');
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

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333 text-align: left;">
                <h2 style="color: #059669;">Hello ${user.name || 'Customer'},</h2>
                <p>Thank you for your purchase! We are pleased to confirm that your order has been placed successfully.</p>
                
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 12px; border: 1px solid #dcfce7; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #166534;">Order ID: ${orderId}</h3>
                    <p style="margin: 0; color: #166534; font-size: 14px;">Placed on: ${new Date().toLocaleString()}</p>
                </div>

                <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Order Summary</h3>
                ${itemsHtml}

                <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 12px;">
                    <h3 style="margin-top: 0;">Your Order QR Code</h3>
                    <p style="color: #64748b; font-size: 14px;">Show this QR code at the store for quick verification.</p>
                    <img src="cid:qrcode" alt="Order QR Code" style="max-width: 200px; border: 2px solid #e2e8f0; padding: 10px; border-radius: 12px; background: white;" />
                </div>

                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                
                <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                    <p>If you have any questions, please contact our support team at support@smartinventory.com.</p>
                    <p>&copy; ${new Date().getFullYear()} Smart Inventory. All rights reserved.</p>
                </div>
            </div>
        `;

        if (useResend) {
            console.log('Using Resend service...');
            const resend = new Resend(resendApiKey);
            const { data, error } = await resend.emails.send({
                from: `Smart Inventory <${fromEmail}>`,
                to: [user.email],
                subject: `Order Confirmation - #${orderId}`,
                html: emailHtml,
                attachments: [
                    {
                        filename: 'qrcode.png',
                        content: qrImageBase64.split("base64,")[1],
                        cid: 'qrcode'
                    }
                ]
            });

            if (error) {
                console.error('Resend Error:', error);
            } else {
                console.log('Order confirmation email sent via Resend:', data.id);
            }
        } else {
            console.log('Using Nodemailer fallback (Gmail)...');
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
                subject: `Order Confirmation - #${orderId}`,
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
            console.log(`Order confirmation email sent to ${user.email} via Gmail`);
        }

    } catch (error) {
        console.error('Error sending order confirmation email:', error.message);
    }
};

module.exports = {
    sendOrderConfirmationEmail
};
