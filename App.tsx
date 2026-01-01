import React, { useState, useEffect } from 'react';
import { Plus, PartyPopper } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Birthday, BirthdayWithCalculations, RelationType } from './types';
import { calculateBirthdayInfo } from './utils';
import { BirthdayCard } from './components/BirthdayCard';
import { AddBirthdayModal } from './components/AddBirthdayModal';

// Dummy data for initial load if empty
const INITIAL_DATA: Birthday[] = [
  { id: '1', name: 'Emma Wilson', dateOfBirth: '1995-10-24', relation: RelationType.FRIEND },
  { id: '2', name: 'Mom', dateOfBirth: '1965-05-12', relation: RelationType.FAMILY },
  { id: '3', name: 'James from Acct', dateOfBirth: '1988-03-15', relation: RelationType.WORK },
];

const App: React.FC = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    const saved = localStorage.getItem('cakeday_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('cakeday_data', JSON.stringify(birthdays));
  }, [birthdays]);

  const addBirthday = (name: string, dateOfBirth: string, relation: RelationType) => {
    const newBirthday: Birthday = {
      id: uuidv4(),
      name,
      dateOfBirth,
      relation,
    };
    setBirthdays((prev) => [...prev, newBirthday]);
  };

  const deleteBirthday = (id: string) => {
    if (confirm('Remove this birthday?')) {
      setBirthdays((prev) => prev.filter(b => b.id !== id));
    }
  };

  // Processing logic
  const processedBirthdays: BirthdayWithCalculations[] = birthdays
    .map(calculateBirthdayInfo)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto border-x border-stone-100 bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur-md px-6 py-5 border-b border-stone-200/60">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-2 rounded-xl text-white shadow-sm rotate-3">
              <PartyPopper className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              CakeDay
            </h1>
          </div>
          <div className="text-xs font-semibold bg-white border border-stone-200 px-3 py-1 rounded-full text-gray-500 shadow-sm">
            {birthdays.length} Events
          </div>
        </div>
      </header>

      {/* List */}
      <main className="px-5 pt-6 space-y-4">
        {processedBirthdays.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <PartyPopper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-400 font-medium">No birthdays yet!</p>
            <p className="text-sm text-gray-300">Tap + to add one.</p>
          </div>
        ) : (
          processedBirthdays.map((b) => (
            <BirthdayCard 
              key={b.id} 
              birthday={b} 
              onDelete={deleteBirthday} 
            />
          ))
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-black/25 active:scale-95 transition-all duration-300 group"
          aria-label="Add Birthday"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Modal */}
      <AddBirthdayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addBirthday}
      />
    </div>
  );
};

export default App;