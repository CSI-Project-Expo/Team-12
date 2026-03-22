require('dotenv').config();
const nodemailer = require('nodemailer');

async function debugBrevo() {
    console.log("Starting SMTP Debug Trace for Brevo...");
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`User: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // upgrades later with STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true,  // Automatically logs all email traffic
        debug: true    // Includes SMTP traffic in the logs
    });

    const mailOptions = {
        from: `"Smart Inventory Tester" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to self so we don't bounce
        subject: `SMTP Diagnostic Test - ${new Date().toISOString()}`,
        text: `This is a test message to trace the SMTP connection. If you receive this, your Brevo configuration is completely perfect.`,
        html: `<p>This is an automated <b>SMTP diagnostic test</b>.</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("\n======================================");
        console.log("✅ SUCCESS! The email was accepted by Brevo.");
        console.log("Message ID:", info.messageId);
        console.log("Response:", info.response);
        console.log("======================================\n");
    } catch (err) {
        console.log("\n======================================");
        console.error("❌ FAILED! Detailed Error:", err.message);
        console.log("======================================\n");
    }
}

debugBrevo();
