import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./LeadsList.css"; // Import the CSS file

function LeadsList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic filters (extend later)
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit,
      };
      if (statusFilter) params["status.equals"] = statusFilter;
      if (search) params["city.contains"] = search; // example filter

      const res = await api.get("/leads", { params });
      setLeads(res.data.data || res.data.leads || []);
      setTotalPages(res.data.totalPages || Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load leads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lead");
    }
  };

  return (
    <div className="leads-list-container">
      <h2>Leads</h2>
      <Link to="/leads/new" className="add-lead-button">Add New Lead</Link>
      {error && <div className="error-message">{error}</div>}
      <div className="filters-and-controls">
        <input
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="limit-select">
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.first_name} {lead.last_name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.company}</td>
                  <td>{lead.city}</td>
                  <td><span className={`status-badge status-${lead.status}`}>{lead.status}</span></td>
                  <td className="actions-cell">
                    <button
                      className="action-button edit-button"
                      onClick={() => navigate(`/leads/${lead._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination-controls">
        <button
          className="pagination-button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LeadsList;