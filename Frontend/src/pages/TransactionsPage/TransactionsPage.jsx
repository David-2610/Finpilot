/* ────────────────────────────────────────────────
   TransactionsPage — list, categorize, and bulk update
   ──────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useFinance } from '@/hooks/useFinance';
import GlassCard from '@/components/Cards/GlassCard';
import Loader from '@/components/common/Loader';
import * as api from '@/services/api';
import './TransactionsPage.css';

export default function TransactionsPage() {
    const { transactions, categories, fetchTransactions, fetchCategories, fetchSummary, fetchAIInsights, hasData } = useFinance();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!hasData) {
            fetchTransactions();
            fetchCategories();
        }
    }, [hasData, fetchTransactions, fetchCategories]);

    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return;
        setSaving(true);
        try {
            const newCat = await api.createCategory(newCategoryName, '🔹');
            await fetchCategories();
            setIsCreatingCategory(false);
            setNewCategoryName('');
            await handleUpdateCategory(newCat._id);
        } catch (err) {
            alert('Failed to create category: ' + (err.response?.data?.message || err.message));
            setSaving(false);
        }
    }

    async function handleUpdateCategory(categoryId) {
        if (!selectedTxn) return;
        setSaving(true);
        try {
            await api.updateTransaction(selectedTxn._id, { categoryId });
            // Refresh to ensure consistency
            await Promise.all([
                fetchTransactions(),
                fetchSummary(),
            ]);
            setIsModalOpen(false);
            setSelectedTxn(null);
        } catch (err) {
            alert('Failed to update category: ' + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (isLoading && !transactions.length) return <Loader text="Loading transactions..." />;

    return (
        <div className="txns-page">
            <header className="txns-header">
                <p className="dash-eyebrow">Financial History</p>
                <h1 className="txns-title">Transaction <em>Registry</em></h1>
            </header>

            <GlassCard className="txns-card">
                <div className="txns-table-container">
                    <table className="txns-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Full Description / Keyword</th>
                                <th>Merchant</th>
                                <th>Mode</th>
                                <th>Category</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(txn => (
                                <tr key={txn._id} className="txns-row">
                                    <td className="txn-date-cell">
                                        {new Date(txn.date).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short'
                                        })}
                                    </td>
                                    <td className="txn-desc-cell">
                                        <div className="txn-raw-desc" title={txn.rawDescription}>
                                            {txn.rawDescription}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="txn-merchant-tag">{txn.merchant || 'Other'}</span>
                                    </td>
                                    <td>
                                        <span className="txn-mode-tag">{txn.paymentMode}</span>
                                    </td>
                                    <td>
                                        <button 
                                            className="txn-cat-badge"
                                            onClick={() => {
                                                setSelectedTxn(txn);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            {txn.categoryId?.icon || '📁'} 
                                            {txn.categoryId?.name || 'Uncategorized'}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }} className={`txn-amount ${txn.type === 'credit' ? 'txn-credit' : 'txn-debit'}`}>
                                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Category selection modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="cat-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">Change Category</h3>
                        <p className="modal-desc">
                            Changing category for <strong>"{selectedTxn?.rawDescription}"</strong> will apply to all existing and future transactions with this exact description.
                        </p>

                        {isCreatingCategory ? (
                            <div className="cat-create-form" style={{ marginBottom: '24px' }}>
                                <input 
                                    type="text" 
                                    className="cat-create-input" 
                                    placeholder="e.g. Health, Utilities..." 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    disabled={saving}
                                    autoFocus
                                />
                                <div className="modal-footer" style={{ marginTop: '16px' }}>
                                    <button className="btn-cancel" onClick={() => setIsCreatingCategory(false)} disabled={saving}>Back</button>
                                    <button className="btn-save" onClick={handleCreateCategory} disabled={saving || !newCategoryName.trim()}>
                                        {saving ? 'Creating...' : 'Create & Apply'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="cat-grid">
                                    {categories.map(cat => (
                                        <button 
                                            key={cat._id} 
                                            className={`cat-opt-btn ${selectedTxn?.categoryId?._id === cat._id ? 'active' : ''}`}
                                            onClick={() => handleUpdateCategory(cat._id)}
                                            disabled={saving}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                    ))}
                                    <button 
                                        className="cat-opt-btn new-cat-btn"
                                        onClick={() => setIsCreatingCategory(true)}
                                        disabled={saving}
                                        style={{ borderStyle: 'dashed', color: 'var(--sage)' }}
                                    >
                                        ➕ New Category
                                    </button>
                                </div>

                                <div className="modal-footer">
                                    <button className="btn-cancel" onClick={() => { setIsModalOpen(false); setIsCreatingCategory(false); setNewCategoryName(''); }}>Cancel</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
