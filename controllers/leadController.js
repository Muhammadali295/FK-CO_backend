import supabase from '../config/supabaseClient.js';

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

    // Ensure property_id is a valid UUID; otherwise fallback to null
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
          property_id: validPropertyId, // Cleaned UUID value
          message: message || null,
          property_address: property_address || null,
          status: 'new',
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const { intent, status } = req.query;

    // Direct select without forcing relational joins
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

// Delete a lead enquiry
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