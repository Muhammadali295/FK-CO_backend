import supabase from '../config/supabaseClient.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const createLead = async (req, res) => {
  try {
    const { full_name, email, phone, intent, lead_type, property_id, message, property_address } = req.body;

    if (!full_name || !email || !intent) {
      return res.status(400).json({ success: false, error: 'Name, email, and intent are required.' });
    }

    const validPropertyId = property_id && isValidUUID(property_id) ? property_id : null;

    const { data, error } = await supabase
      .from('leads_enquiries')
      .insert([
        {
          full_name,
          email,
          phone: phone || null,
          intent,
          lead_type: lead_type || 'general_contact',
          property_id: validPropertyId,
          message: message || null,
          property_address: property_address || null,
          status: 'new',
        },
      ])
      .select();

    if (error) throw error;

    if (lead_type === 'valuation') {
      const mailOptions = {
        from: `"FK&CO Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Valuation Request: ${intent.toUpperCase()} - ${full_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #051329; padding: 20px; text-align: center;">
              <h2 style="color: #D4A44A; margin: 0; font-family: Georgia, serif;">FK&CO ESTATE</h2>
              <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 14px;">New Valuation Submission</p>
            </div>
            
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; width: 140px;"><strong>Client Name:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${full_name}</td>
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
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Intent:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #051329; font-weight: bold; text-transform: uppercase;">${intent}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><strong>Target Property:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${property_address || 'Not provided'}</td>
                </tr>
              </table>

              <h4 style="margin-top: 30px; margin-bottom: 10px; color: #051329;">Valuation Details & Notes:</h4>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #D4A44A; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message || 'No additional details provided.'}</div>
            </div>
          </div>
        `,
      };

      transporter.sendMail(mailOptions).catch(err => {
        console.error('Failed to send valuation email alert:', err);
      });
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const { intent, status } = req.query;

    let query = supabase.from('leads_enquiries').select('*');

    if (intent) query = query.eq('intent', intent);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, count: data ? data.length : 0, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'new', 'contacted', 'closed'

    const { data, error } = await supabase
      .from('leads_enquiries')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Lead status updated successfully', data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('leads_enquiries').delete().eq('id', id);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};