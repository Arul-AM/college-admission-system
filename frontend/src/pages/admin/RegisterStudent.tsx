import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { getDepartments, getActiveDay, registerStudent } from '../../services/api';
import type { Department, AdmissionDay } from '../../types';
import { ADMISSION_ROUNDS } from '../../constants';
import { getErrorMessage } from '../../utils';

const RegisterStudent: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeDay, setActiveDay] = useState<AdmissionDay | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ token: string; name: string } | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    allotment_number: '',
    student_name: '',
    department_id: '',
    admission_round: '',
    fee_paid: 'true',
    remarks: '',
  });

  useEffect(() => {
    const load = async () => {
      const [deptRes, dayRes] = await Promise.all([getDepartments(), getActiveDay()]);
      setDepartments(deptRes.data.departments);
      setActiveDay(dayRes.data.activeDay);
    };
    load();
  }, []);

  const selectedDept = departments.find(d => d.id === form.department_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.allotment_number || !form.student_name || !form.department_id || !form.admission_round) {
      setError('Please fill all required fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await registerStudent({ ...form, fee_paid: form.fee_paid === 'true' });
      setSuccess({ token: res.data.tokenNumber, name: form.student_name });
      setForm({ allotment_number: '', student_name: '', department_id: '', admission_round: '', fee_paid: 'true', remarks: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Registered!</h2>
          <p className="text-gray-600 mb-6">{success.name} has been successfully registered.</p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="text-sm text-blue-600 font-medium mb-1">Token Number</div>
            <div className="text-3xl font-bold text-blue-900 font-mono">{success.token}</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSuccess(null)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              Register Another
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Register Student</h2>
            <p className="text-sm text-gray-500">Fill in student details to generate a token</p>
          </div>
        </div>

        {/* Active Day Banner */}
        {activeDay ? (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">
              Active Admission Day: <strong>{activeDay.name}</strong>
            </span>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">
              No active admission day configured. Contact admin before registering students.
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allotment Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.allotment_number}
                onChange={e => setForm({ ...form, allotment_number: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. 1234567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.student_name}
                onChange={e => setForm({ ...form, student_name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Full name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={form.department_id}
                onChange={e => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="">Select department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {selectedDept && (
                <div className="text-xs text-blue-600 mt-1">Code: <strong>{selectedDept.code}</strong></div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admission Round <span className="text-red-500">*</span>
              </label>
              <select
                value={form.admission_round}
                onChange={e => setForm({ ...form, admission_round: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="">Select round</option>
                {Object.entries(ADMISSION_ROUNDS).map(([val, label]) => (
                  <option key={val} value={val}>{label} ({val})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fee Payment Status <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {[
                { value: 'true', label: '✅ Fee Paid → Stage 1', cls: 'border-green-300 bg-green-50 text-green-700' },
                { value: 'false', label: '⚠️ Fee Pending → Help Desk', cls: 'border-orange-300 bg-orange-50 text-orange-700' },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center gap-2 flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${form.fee_paid === opt.value ? opt.cls + ' border-opacity-100' : 'border-gray-200 bg-white'}`}>
                  <input
                    type="radio"
                    name="fee_paid"
                    value={opt.value}
                    checked={form.fee_paid === opt.value}
                    onChange={e => setForm({ ...form, fee_paid: e.target.value })}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
            <textarea
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !activeDay}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Registering...' : 'Register & Generate Token'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudent;
