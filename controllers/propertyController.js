import supabase from '../config/supabaseClient.js';

export const getAllProperties = async (req, res) => {
  try {
    const { type, status, city } = req.query;

    let query = supabase.from('properties').select('*');

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);
    if (city) query = query.ilike('city', `%${city}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Property not found' });
  }
};

export const createProperty = async (req, res) => {
  try {
    const { title, price, type, status, bedrooms, bathrooms, area_sqft, address, city, description, images } = req.body;

    if (!title || !price || !address || !city) {
      return res.status(400).json({ success: false, error: 'Title, price, address, and city are required fields.' });
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          title,
          price: Number(price),
          type: type || 'buy',
          status: status || 'available',
          bedrooms: bedrooms ? Number(bedrooms) : 0,
          bathrooms: bathrooms ? Number(bathrooms) : 0,
          area_sqft: area_sqft ? Number(area_sqft) : null,
          address,
          city,
          description: description || '',
          images: images || [],
        },
      ])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Property listing created successfully!', data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Property updated successfully', data: data[0] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) throw error;
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};