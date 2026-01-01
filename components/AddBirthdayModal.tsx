import React, { useState } from 'react';
import { X, User, Calendar, Tag } from 'lucide-react';
import { RelationType } from '../types';

interface AddBirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, date: string, relation: RelationType) => void;
}

export const AddBirthdayModal: React.FC<AddBirthdayModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [relation, setRelation] = useState<RelationType>(RelationType.FRIEND);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && date) {
      onAdd(name, date, relation);
      setName('');
      setDate('');
      setRelation(RelationType.FRIEND);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-md relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-cream px-6 py-4 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">New Birthday</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <User className="w-4 h-4" /> Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-800 focus:ring-0 outline-none transition-all bg-gray-50 focus:bg-white text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date of Birth
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-800 focus:ring-0 outline-none transition-all bg-gray-50 focus:bg-white text-lg font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Relation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(RelationType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRelation(type)}
                  className={`py-2 px-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                    relation === type 
                      ? 'border-gray-800 bg-gray-800 text-white' 
                      : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
          >
            Add to List
          </button>
        </form>
      </div>
    </div>
  );
};