const qrcode = require('qrcode');
const { Resend } = require('resend');

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
        if (!process.env.RESEND_API_KEY) {
            console.log('RESEND_API_KEY not found in .env. Skipping email sending.');
            return;
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

        console.log('Using Resend from email:', fromEmail);

        // Generate QR code as Base64 image Buffer for Resend
        const qrImageBuffer = await qrcode.toBuffer(qrString, {
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
            from: `"Smart Inventory" <${fromEmail}>`,
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
                        <!-- For Resend inline image compatibility -->
                        <img src="cid:qrcode" alt="Order QR Code" style="max-width: 200px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;" />
                        <br/>
                        <p style="color: #999; font-size: 12px; margin-top: 10px;">(If the QR code does not display, please see the attachment)</p>
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
                    content: qrImageBuffer,
                    // Optional content_id for CID embedding support
                    content_id: 'qrcode'
                }
            ]
        };

        const { data, error } = await resend.emails.send(mailOptions);

        if (error) {
            console.error('Error sending order confirmation email via Resend:', error.message);
        } else {
            console.log(`Order confirmation email sent to ${user.email}, id: ${data?.id}`);
        }

    } catch (error) {
        console.error('Exception while sending order confirmation email:', error.message);
        // Do not rethrow the error to prevent blocking the order process
    }
};

module.exports = {
    sendOrderConfirmationEmail
};
