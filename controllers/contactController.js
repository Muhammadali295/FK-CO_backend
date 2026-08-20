import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
  try {
    const { fullName, email, phone, enquiryType, message, consent } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"FK&CO Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New Enquiry: ${enquiryType} - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #051329; padding: 20px; text-align: center;">
            <h2 style="color: #D4A44A; margin: 0; font-family: Georgia, serif;">FK&CO ESTATE</h2>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">New Contact Submission</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff; color: #333333;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; width: 120px;"><strong>Client Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Phone:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Enquiry Type:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #051329; font-weight: bold;">${enquiryType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Consent Given:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${consent ? 'Yes' : 'No'}</td>
              </tr>
            </table>

            <h4 style="margin-top: 30px; margin-bottom: 10px; color: #051329;">Message:</h4>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #D4A44A; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email dispatched to admin.' });
  } catch (err) {
    console.error('Email Send Error:', err);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
};