import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./LeadForm.css"; // We'll create this CSS file

function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    last_activity_at: "",
    is_qualified: false,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get(`/leads/${id}`)
        .then((res) => {
          const lead = res.data;
          setFormData({
            ...formData,
            ...lead,
            last_activity_at: lead.last_activity_at
              ? lead.last_activity_at.substring(0, 16) // for datetime-local input
              : "",
          });
        })
        .catch(() => setError("Failed to load lead"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isEdit) {
        await api.put(`/leads/${id}`, {
          ...formData,
          last_activity_at: formData.last_activity_at || null,
        });
      } else {
        await api.post("/leads", {
          ...formData,
          last_activity_at: formData.last_activity_at || null,
        });
      }
      navigate("/leads");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="lead-form-container">
      <h2>{isEdit ? "Edit Lead" : "Create Lead"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="source">Source</label>
          <select id="source" name="source" value={formData.source} onChange={handleChange}>
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="score">Score</label>
          <input
            id="score"
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lead_value">Lead Value</label>
          <input
            id="lead_value"
            type="number"
            name="lead_value"
            value={formData.lead_value}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="last_activity_at">Last Activity At</label>
          <input
            id="last_activity_at"
            type="datetime-local"
            name="last_activity_at"
            value={formData.last_activity_at}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="is_qualified">
            <input
              id="is_qualified"
              type="checkbox"
              name="is_qualified"
              checked={formData.is_qualified}
              onChange={handleChange}
            />
            Is Qualified
          </label>
        </div>

        <button type="submit" className="submit-button">
          {isEdit ? "Update Lead" : "Create Lead"}
        </button>
      </form>
    </div>
  );
}

export default LeadForm;