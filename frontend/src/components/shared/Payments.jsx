import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await api.get(`/payments?landlordId=${user.id || 1}`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Payment History</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>View all transaction records.</p>
      </div>

      <div className="card">
        <div className="table-container">
          {payments.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
              <CreditCard size={48} color="#94A3B8" style={{ margin: '0 auto 1rem auto' }} />
              <p>No payments recorded yet.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td style={{ fontWeight: 500 }}>{payment.mpesa_receipt_number || payment.id}</td>
                    <td>{payment.first_name} {payment.last_name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{payment.unit_number}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>KES {payment.amount}</td>
                    <td>
                      <span className={`badge ${payment.status === 'completed' ? 'badge-paid' : 'badge-pending'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
