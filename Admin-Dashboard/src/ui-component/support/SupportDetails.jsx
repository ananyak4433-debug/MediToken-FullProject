import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateStatusRequest,
    replyToRequestRequest
} from 'container/SupportRequestContainer/slice';
import { Card, CardContent, Box, Typography } from '@mui/material';

const StatusBadge = ({ status }) => {
    const styles = {
        Open: { background: '#e0f5f2', color: '#077a6d' },
        Pending: { background: '#fef3dc', color: '#8a5c00' },
        Closed: { background: '#f0f0ee', color: '#7a8a88' },
    };
    return (
        <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, ...styles[status] }}>
            {status}
        </span>
    );
};

const SupportDetails = ({ ticket, onBack }) => {
    const dispatch = useDispatch();
    const { replyLoading, requests } = useSelector((state) => state.supportRequests);

    // always read latest from store
    const latest = requests.find(r => r._id === ticket._id) || ticket;

    const [reply, setReply] = useState('');
    const [replyFocus, setReplyFocus] = useState(false);

    const handleSendReply = () => {
        if (!reply.trim()) return;
        dispatch(replyToRequestRequest({ id: latest._id, message: reply }));
        setReply('');
    };

    const handleMarkPending = () => {
        dispatch(updateStatusRequest({ id: latest._id, status: 'Pending' }));
    };

    const handleClose = () => {
        dispatch(updateStatusRequest({ id: latest._id, status: 'Closed' }));
    };

    return (
        <Card>
            <CardContent>
                <div style={{ fontFamily: "'Nunito', sans-serif" }}>

                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button
                                onClick={onBack}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0e9e8e', background: '#f0faf9', border: '1px solid #c0e4de', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}
                            >
                                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                                Back
                            </button>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3a38' }}>{latest.subject}</div>
                                <div style={{ fontSize: 12, color: '#7aaeaa', marginTop: 2 }}>
                                    {latest.vendor?.name || latest.vendor?.hospitalName || latest.name} · {latest.supportType}
                                </div>
                            </div>
                        </div>
                        <StatusBadge status={latest.status} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 16 }}>
                        {/* Left */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Ticket Details */}
                            <div style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0faf9' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a38' }}>Ticket Details</span>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                        {[
                                            { label: 'Vendor', value: latest.vendor?.name || latest.vendor?.hospitalName || latest.name },
                                            { label: 'Email', value: latest.email },
                                            { label: 'Support Type', value: latest.supportType },
                                            { label: 'Date', value: new Date(latest.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                                        ].map(({ label, value }) => (
                                            <div key={label} style={{ fontSize: 12, background: '#f5fafa', border: '1px solid #e0f0ee', borderRadius: 8, padding: '6px 12px', color: '#5a8a85' }}>
                                                <span style={{ color: '#9ab8b5', fontWeight: 600 }}>{label}: </span>
                                                <span style={{ fontWeight: 700, color: '#1a3a38' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#7aaeaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Issue Description</div>
                                    <div style={{ fontSize: 13, color: '#4a6a68', lineHeight: 1.75, background: '#f8fdfc', borderRadius: 8, padding: '14px 16px', border: '1px solid #eaf5f3' }}>
                                        {latest.message}
                                    </div>
                                </div>
                            </div>

                            {/* Reply Thread */}
                            <div style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0faf9' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a38' }}>Reply Thread</span>
                                </div>
                                <div style={{ padding: '16px 20px', minHeight: 80 }}>
                                    {!latest.replies || latest.replies.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: '#b0cecc', fontSize: 13, padding: '16px 0' }}>No replies yet</div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {latest.replies.map((r, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: r.sentBy === 'admin' ? 'flex-end' : 'flex-start' }}>
                                                    <div style={{ maxWidth: '80%', background: r.sentBy === 'admin' ? '#e0f5f2' : '#f5fafa', border: '1px solid #e0f0ee', borderRadius: r.sentBy === 'admin' ? '10px 10px 0 10px' : '10px 10px 10px 0', padding: '10px 14px' }}>
                                                        <div style={{ fontSize: 13, color: '#1a3a38', lineHeight: 1.6 }}>{r.message}</div>
                                                        <div style={{ fontSize: 10, color: '#7aaeaa', marginTop: 4, textAlign: r.sentBy === 'admin' ? 'right' : 'left', fontWeight: 600 }}>
                                                            {r.sentBy === 'admin' ? 'Admin' : 'Vendor'} · {new Date(r.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {latest.status !== 'Closed' && (
                                    <div style={{ padding: '12px 20px', borderTop: '1px solid #f0faf9' }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#7aaeaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Reply to Vendor</div>
                                        <textarea
                                            value={reply}
                                            onChange={e => setReply(e.target.value)}
                                            onFocus={() => setReplyFocus(true)}
                                            onBlur={() => setReplyFocus(false)}
                                            placeholder="Type your response to the vendor…"
                                            style={{ width: '100%', border: `1px solid ${replyFocus ? '#0e9e8e' : '#d4eeea'}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', color: '#2a4a47', background: '#fff', resize: 'none', height: 80, outline: 'none', boxShadow: replyFocus ? '0 0 0 3px rgba(14,158,142,0.1)' : 'none', transition: 'border-color 0.15s' }}
                                        />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                            <button
                                                onClick={handleSendReply}
                                                disabled={replyLoading}
                                                style={{ fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0e9e8e', color: '#fff', cursor: 'pointer', opacity: replyLoading ? 0.7 : 1 }}
                                            >
                                                {replyLoading ? 'Sending…' : 'Send Reply'}
                                            </button>
                                            <button onClick={() => setReply('')} style={{ fontSize: 12, fontWeight: 700, padding: '8px 18px', borderRadius: 8, border: '1px solid #d4eeea', background: '#f8fdfc', color: '#7aaeaa', cursor: 'pointer' }}>
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {latest.status === 'Closed' && (
                                    <div style={{ padding: '12px 20px', borderTop: '1px solid #f0faf9', textAlign: 'center', fontSize: 12, color: '#9ab8b5', background: '#f8fdfc' }}>
                                        This ticket is closed. No further replies can be sent.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Actions */}
                            <div style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0faf9' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a38' }}>Actions</span>
                                </div>
                                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {latest.status !== 'Closed' ? (
                                        <>
                                            <button
                                                onClick={handleMarkPending}
                                                disabled={latest.status === 'Pending'}
                                                style={{ width: '100%', fontSize: 13, fontWeight: 700, padding: '10px 16px', borderRadius: 8, border: '1px solid #c0e4de', background: latest.status === 'Pending' ? '#f0faf9' : '#fff', color: latest.status === 'Pending' ? '#b0cecc' : '#0e9e8e', cursor: latest.status === 'Pending' ? 'not-allowed' : 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                                            >
                                                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {latest.status === 'Pending' ? 'Already Pending' : 'Mark as Pending'}
                                            </button>
                                            <button
                                                onClick={handleClose}
                                                style={{ width: '100%', fontSize: 13, fontWeight: 700, padding: '10px 16px', borderRadius: 8, border: '1px solid #f5c0c0', background: '#fde8e8', color: '#a02020', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}
                                            >
                                                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Close Ticket
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: 13, color: '#9ab8b5', textAlign: 'center', padding: '8px 0' }}>
                                            No actions available — ticket is closed.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0faf9' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a38' }}>Status Timeline</span>
                                </div>
                                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {[
                                        { label: 'Ticket Opened', done: true, time: new Date(latest.createdAt).toLocaleDateString('en-IN') },
                                        { label: 'In Progress', done: latest.status !== 'Open', time: latest.status !== 'Open' ? 'Updated' : '—' },
                                        { label: 'Ticket Closed', done: latest.status === 'Closed', time: latest.status === 'Closed' ? 'Resolved' : '—' },
                                    ].map(({ label, done, time }, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#e0f5f2' : '#f5fafa', border: `2px solid ${done ? '#0e9e8e' : '#d4eeea'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                {done
                                                    ? <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#0e9e8e" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                                                    : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d4eeea' }} />
                                                }
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: done ? '#1a3a38' : '#9ab8b5' }}>{label}</div>
                                                <div style={{ fontSize: 11, color: '#9ab8b5' }}>{time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vendor Info */}
                            <div style={{ background: '#fff', border: '1px solid #e0f0ee', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0faf9' }}>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1a3a38' }}>Vendor Info</span>
                                </div>
                                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        { label: 'Name', value: latest.vendor?.name || latest.vendor?.hospitalName || latest.name },
                                        { label: 'Email', value: latest.email },
                                        { label: 'Support Type', value: latest.supportType },
                                        { label: 'Raised on', value: new Date(latest.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                            <span style={{ color: '#9ab8b5', fontWeight: 600 }}>{label}</span>
                                            <span style={{ color: '#1a3a38', fontWeight: 700 }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SupportDetails;