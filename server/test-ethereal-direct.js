const nodemailer = require('nodemailer');

async function testEtherealDirectly() {
    console.log("Generating fake Ethereal account...");
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    console.log("Creating Ethereal transporter...");
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    console.log("Sending test email out...");
    try {
        let info = await transporter.sendMail({
            from: '"Smart Inventory Test" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello from Ethereal Testing ✔", // Subject line
            text: "This is a test to verify the Ethereal system directly.", // plain text body
            html: "<b>This is a test to verify the Ethereal system directly.</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("\n==================================");
        console.log("✅ SUCCESS! Preview URL below:");
        const url = nodemailer.getTestMessageUrl(info);
        console.log(url);
        require('fs').writeFileSync('ethereal-url.txt', url);
        console.log("==================================\n");

    } catch(err) {
        console.error("Ethereal Error:", err);
    }
}

testEtherealDirectly();
