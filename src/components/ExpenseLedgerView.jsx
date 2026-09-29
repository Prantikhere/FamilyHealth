import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  TrendingDown, 
  TrendingUp, 
  PieChart, 
  Plus, 
  AlertCircle, 
  Receipt, 
  ShoppingBag, 
  Building2, 
  FlaskConical, 
  Users,
  X
} from 'lucide-react';

export default function ExpenseLedgerView({ household, onAddExpense }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(household.members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('Medication');
  const [notes, setNotes] = useState('');

  // Calculate total spending
  const totalSpend = useMemo(() => {
    return household.records.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  }, [household.records]);

  // Calculate monthly spending (current month)
  const currentMonthSpend = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    return household.records
      .filter(r => r.date && r.date.startsWith(currentMonth))
      .reduce((acc, curr) => acc + (curr.cost || 0), 0);
  }, [household.records]);

  const budgetCap = household.monthlyBudgetCap || 25000;
  const budgetUsagePercent = Math.min(Math.round((currentMonthSpend / budgetCap) * 100), 100);

  // Group costs by category
  const categoryBreakdown = useMemo(() => {
    const cats = {
      'Medication': 0,
      'Lab Tests': 0,
      'Hospital Visits': 0,
      'Traditional / Chemist': 0,
    };

    household.records.forEach(r => {
      const cat = r.category || (r.type === 'Prescription' ? 'Medication' : r.type === 'Lab Test' ? 'Lab Tests' : 'Hospital Visits');
      if (cats[cat] !== undefined) {
        cats[cat] += (r.cost || 0);
      } else {
        cats['Medication'] += (r.cost || 0);
      }
    });

    return cats;
  }, [household.records]);

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) {
      alert('Please enter a valid expense amount');
      return;
    }

    const newRecord = {
      id: `rec_${Date.now()}`,
      memberId: selectedMemberId,
      type: category === 'Medication' ? 'Prescription' : category === 'Lab Tests' ? 'Lab Test' : 'Receipt',
      category: category,
      provider: provider.trim() || 'Local Chemist / Community Health Post',
      date: new Date().toISOString().split('T')[0],
      details: notes.trim() || `${category} paid out-of-pocket`,
      cost: parseFloat(amount),
      verified: true,
    };

    onAddExpense(newRecord);
    setShowAddModal(false);
    setAmount('');
    setProvider('');
    setNotes('');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Out-of-Pocket Cash Ledger</span>
            <span className="text-[10px] font-bold bg-amber-light text-amber-alert px-2 py-0.5 rounded-full border border-amber-300">
              100% Self-Funded
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor healthcare expenditures and protect against catastrophic medical debt.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-dark"
        >
          <Plus className="w-4 h-4" /> Log Expense
        </button>
      </div>

      {/* 1. SPEND HERO CARD */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-300 bg-gradient-to-br from-white/95 to-slate-50/90 shadow-sm text-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Total Household Cash Health Outlay
        </span>
        <div className="text-3xl font-black text-slate-900 my-1.5 tracking-tight">
          {household.currency}{totalSpend.toLocaleString()}
        </div>
        <p className="text-[11px] text-slate-500 font-medium">
          Zero health insurance coverage • Completely paid in cash at point of care
        </p>
      </div>

      {/* 2. BUDGET CAP PROGRESS */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
          <span className="text-slate-800">Monthly Household Health Budget</span>
          <span className={currentMonthSpend > budgetCap ? 'text-rose-emergency' : 'text-slate-700'}>
            {household.currency}{currentMonthSpend.toLocaleString()} / {household.currency}{budgetCap.toLocaleString()} ({budgetUsagePercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              budgetUsagePercent >= 90 ? 'bg-rose-emergency' : budgetUsagePercent >= 70 ? 'bg-amber-500' : 'bg-emerald-primary'
            }`}
            style={{ width: `${budgetUsagePercent}%` }}
          />
        </div>

        {budgetUsagePercent >= 90 && (
          <div className="mt-2 text-[11px] text-rose-emergency font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Monthly health budget cap approached. Prioritize generic formularies.</span>
          </div>
        )}
      </div>

      {/* 3. EXPENSE CATEGORIZATION GRAPH */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Spending Breakdown by Category
        </h3>

        <div className="space-y-2.5">
          {Object.entries(categoryBreakdown).map(([cat, sum]) => {
            const pct = totalSpend > 0 ? Math.round((sum / totalSpend) * 100) : 0;
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat}</span>
                  <span className="font-bold text-slate-900">{household.currency}{sum.toLocaleString()} ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-primary rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SPEND BY FAMILY MEMBER */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Cash Outlay by Family Member
        </h3>

        <div className="space-y-2">
          {household.members.map((member) => {
            const memberSpend = household.records
              .filter(r => r.memberId === member.id)
              .reduce((acc, curr) => acc + (curr.cost || 0), 0);

            return (
              <div 
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/70 border border-slate-200/80"
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: member.avatarBg }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{member.name}</span>
                    <span className="text-[10px] text-slate-500">{member.relation}</span>
                  </div>
                </div>

                <span className="text-xs font-black text-slate-900">
                  {household.currency}{memberSpend.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TRANSACTION LOG */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Receipt & Payment History ({household.records.length})
        </h3>

        <div className="space-y-2">
          {household.records.map((rec) => {
            const member = household.members.find(m => m.id === rec.memberId);
            return (
              <div key={rec.id} className="glass-panel rounded-xl p-3 flex items-center justify-between gap-3 border border-slate-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-primary flex-shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{rec.provider}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{member?.name || 'Member'} • {rec.date}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-slate-900 block">
                    {household.currency}{Number(rec.cost || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {rec.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOG EXPENSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <h3 className="text-sm font-bold">Log Out-of-Pocket Expense</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">For Family Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  {household.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.relation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Amount Paid ({household.currency}) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 4500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Provider / Chemist / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Adeyemi Chemist, St Nicholas"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Medication">Medication & Formularies</option>
                  <option value="Lab Tests">Lab Tests & Investigations</option>
                  <option value="Hospital Visits">Hospital / Clinic Consultation</option>
                  <option value="Traditional / Chemist">Traditional / Unregistered Provider</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Receipt Note / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Malaria treatment pack + analgesics"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 rounded-xl bg-emerald-primary text-white font-bold hover:bg-emerald-dark"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
