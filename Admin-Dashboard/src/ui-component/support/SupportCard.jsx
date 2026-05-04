import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow, Chip
} from '@mui/material';
import { getAllRequestsRequest } from 'container/SupportRequestContainer/slice';


const StatusBadge = ({ status }) => {
  const styles = {
    Open:    { background: '#e0f5f2', color: '#077a6d' },
    Pending: { background: '#fef3dc', color: '#8a5c00' },
    Closed:  { background: '#f0f0ee', color: '#7a8a88' },
  };
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, ...styles[status] }}>
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    High:   { background: '#fde8e8', color: '#a02020' },
    Medium: { background: '#fef3dc', color: '#8a5c00' },
    Low:    { background: '#f0f0ee', color: '#7a8a88' },
  };
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, ...styles[priority] }}>
      {priority}
    </span>
  );
};

const SupportCard = ({ onSelectTicket }) => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.supportRequests);

  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(getAllRequestsRequest());
  }, [dispatch]);

  const stats = useMemo(() => ({
    total:   requests.length,
    open:    requests.filter(r => r.status === 'Open').length,
    pending: requests.filter(r => r.status === 'Pending').length,
    closed:  requests.filter(r => r.status === 'Closed').length,
  }), [requests]);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchFilter = filter === 'All' || r.status === filter;
      const q = search.toLowerCase();
      const vendorName = r.vendor?.name || r.vendor?.hospitalName || '';
      const matchSearch = !q ||
        r.subject?.toLowerCase().includes(q) ||
        vendorName.toLowerCase().includes(q) ||
        r._id?.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [requests, filter, search]);

  const handleSelect = (ticket) => {
    setSelectedId(ticket._id);
    onSelectTicket(ticket);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={3} mt={1} ml={1}>
          <Typography variant="h5" sx={{ fontSize: '1.5rem' }}>Support Management 🎧</Typography>
        </Box>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Requests', value: stats.total,   sub: 'All time',      subColor: '#0e9e8e', iconBg: '#e0f5f2', iconStroke: '#0e9e8e' },
            { label: 'Open',           value: stats.open,    sub: 'Awaiting reply', subColor: '#0e9e8e', iconBg: '#e0f5f2', iconStroke: '#0e9e8e' },
            { label: 'Pending',        value: stats.pending, sub: 'In progress',    subColor: '#c9860a', iconBg: '#fef3dc', iconStroke: '#c9860a' },
            { label: 'Closed',         value: stats.closed,  sub: 'Resolved',       subColor: '#9ab8b5', iconBg: '#e5f7ef', iconStroke: '#1a9e6a' },
          ].map(({ label, value, sub, subColor, iconBg, iconStroke }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#7aaeaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#1a3a38', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, marginTop: 5, fontWeight: 600, color: subColor }}>{sub}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0faf9' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a38' }}>Vendor Support Requests</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderBottom: '1px solid #f0faf9', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 140, position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#9ab8b5" strokeWidth={2}>
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                style={{ width: '100%', height: 32, border: '1px solid #d4eeea', borderRadius: 8, padding: '0 10px 0 32px', fontSize: 12, fontFamily: 'inherit', background: '#f8fdfc', color: '#2a4a47', outline: 'none' }}
                placeholder="Search by subject or vendor…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['All', 'Open', 'Pending', 'Closed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, border: filter === f ? '1px solid #0e9e8e' : '1px solid #d4eeea', background: filter === f ? '#0e9e8e' : '#f8fdfc', color: filter === f ? '#fff' : '#7aaeaa', cursor: 'pointer' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Subject', 'Vendor', 'Support Type', 'Date', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 700, color: '#7aaeaa', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '9px 20px', textAlign: 'left', background: '#f8fdfc', borderBottom: '1px solid #f0faf9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#9ab8b5' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#9ab8b5', fontSize: 13 }}>No tickets found</td></tr>
              ) : filtered.map(r => (
                <tr
                  key={r._id}
                  style={{ background: selectedId === r._id ? '#f0faf9' : 'transparent', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { if (selectedId !== r._id) e.currentTarget.style.background = '#f8fdfc'; }}
                  onMouseLeave={e => { if (selectedId !== r._id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ fontSize: 13, fontWeight: 600, color: '#2a4a47', padding: '11px 20px', borderBottom: '1px solid #f8fdfc' }}>{r.subject}</td>
                  <td style={{ fontSize: 13, color: '#5a8a85', padding: '11px 20px', borderBottom: '1px solid #f8fdfc' }}>
                    {r.vendor?.name || r.vendor?.hospitalName || r.name || '—'}
                  </td>
                  <td style={{ fontSize: 13, color: '#5a8a85', padding: '11px 20px', borderBottom: '1px solid #f8fdfc' }}>{r.supportType}</td>
                  <td style={{ fontSize: 12, color: '#9ab8b5', padding: '11px 20px', borderBottom: '1px solid #f8fdfc' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '11px 20px', borderBottom: '1px solid #f8fdfc' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '11px 20px', borderBottom: '1px solid #f8fdfc' }}>
                    <button
                      onClick={() => handleSelect(r)}
                      style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, border: '1px solid #c0e4de', background: '#f0faf9', color: '#0e9e8e', cursor: 'pointer' }}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCard;