import Lead from '../models/Lead.js';
import mongoose from 'mongoose';

export const createLead = async (req, res) => {
  const lead = await Lead.create({ ...req.body, owner: req.user._id });
  res.status(201).json(lead);
};

export const getLeads = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // default 20, max 100
    const skip = (page - 1) * limit;

    // Base query for ownership
    const query = { owner: req.user._id };

    // ---- STRING fields (equals, contains) ----
    ['email', 'company', 'city'].forEach(field => {
      if (req.query[`${field}.equals`]) {
        query[field] = req.query[`${field}.equals`];
      }
      if (req.query[`${field}.contains`]) {
        query[field] = { $regex: req.query[`${field}.contains`], $options: 'i' };
      }
    });

    // ---- ENUM fields (equals, in) ----
    ['status', 'source'].forEach(field => {
      if (req.query[`${field}.equals`]) {
        query[field] = req.query[`${field}.equals`];
      }
      if (req.query[`${field}.in`]) {
        query[field] = { $in: req.query[`${field}.in`].split(',') };
      }
    });

    // ---- NUMBER fields (equals, gt, lt, between) ----
    ['score', 'lead_value'].forEach(field => {
      const conditions = {};
      if (req.query[`${field}.equals`]) {
        conditions.$eq = Number(req.query[`${field}.equals`]);
      }
      if (req.query[`${field}.gt`]) {
        conditions.$gt = Number(req.query[`${field}.gt`]);
      }
      if (req.query[`${field}.lt`]) {
        conditions.$lt = Number(req.query[`${field}.lt`]);
      }
      if (req.query[`${field}.between`]) {
        const [min, max] = req.query[`${field}.between`].split(',').map(Number);
        conditions.$gte = min;
        conditions.$lte = max;
      }
      if (Object.keys(conditions).length) query[field] = conditions;
    });

    // ---- DATE fields (on, before, after, between) ----
    ['created_at', 'last_activity_at'].forEach(field => {
      const conditions = {};
      if (req.query[`${field}.on`]) {
        const date = new Date(req.query[`${field}.on`]);
        conditions.$gte = date;
        conditions.$lt = new Date(date.getTime() + 24 * 60 * 60 * 1000); // next day
      }
      if (req.query[`${field}.before`]) {
        conditions.$lt = new Date(req.query[`${field}.before`]);
      }
      if (req.query[`${field}.after`]) {
        conditions.$gt = new Date(req.query[`${field}.after`]);
      }
      if (req.query[`${field}.between`]) {
        const [start, end] = req.query[`${field}.between`].split(',').map(d => new Date(d));
        conditions.$gte = start;
        conditions.$lte = end;
      }
      if (Object.keys(conditions).length) query[field] = conditions;
    });

    // ---- BOOLEAN field (equals) ----
    if (req.query['is_qualified.equals']) {
      query.is_qualified = req.query['is_qualified.equals'] === 'true';
    }

    // ---- Query DB ----
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    res.json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error in getLeads:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getLead = async (req, res) => {
  try {
    const { id } = req.params;

    //1. Validate the ID first
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid lead id' });
    }

    // 2. Find the lead for this user
    const lead = await Lead.findOne({ _id: id, owner: req.user._id });

    // 3. Handle not found
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    //4. Return the lead
    res.json(lead);
  } 
  catch (err) {
    console.error('Error in getLead:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateLead = async (req, res) => {
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );
  if (!lead) return res.status(404).json({ message: 'Not found' });
  res.json(lead);
};

export const deleteLead = async (req, res) => {
  const lead = await Lead.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!lead) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
};
