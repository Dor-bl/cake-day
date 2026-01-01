import React, { useState } from 'react';
import { Share2, Gift, Briefcase, Users, Calendar, Sparkles } from 'lucide-react';
import { BirthdayWithCalculations, RelationType } from '../types';
import { formatDate, getOrdinalSuffix, getGiftSuggestions } from '../utils';
import confetti from 'canvas-confetti';

interface BirthdayCardProps {
  birthday: BirthdayWithCalculations;
  onDelete: (id: string) => void;
}

export const BirthdayCard: React.FC<BirthdayCardProps> = ({ birthday, onDelete }) => {
  const [showGifts, setShowGifts] = useState(false);
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const dateStr = formatDate(birthday.nextBirthdayDate);
    const text = `Hey! ${birthday.name}'s birthday is coming up on ${dateStr}! Let's plan something! 🎂`;
    
    if (navigator.share) {
      navigator.share({
        title: `${birthday.name}'s Birthday`,
        text: text,
      }).catch((error) => {
        // Ignore AbortError which happens when user cancels the share sheet
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      });
    } else {
      // Fallback for desktop/unsupported
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const handleConfetti = () => {
    if (birthday.isToday) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Trigger confetti automatically if mounted and it is today
  React.useEffect(() => {
    if (birthday.isToday) {
      const timer = setTimeout(() => handleConfetti(), 500);
      return () => clearTimeout(timer);
    }
  }, [birthday.isToday]);

  const getTheme = (relation: RelationType) => {
    switch (relation) {
      case RelationType.FAMILY:
        return {
          bg: 'bg-coral-100',
          text: 'text-coral-800',
          icon: <Gift className="w-4 h-4" />,
          accent: 'bg-coral-500',
          shadow: 'shadow-coral-100'
        };
      case RelationType.WORK:
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: <Briefcase className="w-4 h-4" />,
          accent: 'bg-purple-500',
          shadow: 'shadow-purple-100'
        };
      case RelationType.FRIEND:
      default:
        return {
          bg: 'bg-teal-100',
          text: 'text-teal-800',
          icon: <Users className="w-4 h-4" />,
          accent: 'bg-teal-500',
          shadow: 'shadow-teal-100'
        };
    }
  };

  const theme = getTheme(birthday.relation);
  const suggestions = getGiftSuggestions(birthday.relation, birthday.ageTurning);

  return (
    <div 
      className={`relative group bg-white rounded-3xl p-5 shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden ${birthday.isToday ? 'ring-2 ring-offset-2 ring-yellow-400' : ''}`}
      onClick={birthday.isToday ? handleConfetti : undefined}
    >
      <div className="flex justify-between items-start pl-3"> {/* Added padding-left to account for the bar */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${theme.bg} ${theme.text}`}>
              {theme.icon}
              {birthday.relation}
            </span>
            {birthday.isToday && (
              <span className="animate-bounce inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                🎉 It's Today!
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 leading-tight">
            {birthday.name}
          </h3>
          
          <div className="flex items-center text-gray-500 text-sm mt-1 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {formatDate(birthday.nextBirthdayDate)}
          </div>
        </div>

        <div className="flex flex-col items-end">
           <div className={`text-2xl font-black ${birthday.isToday ? 'text-yellow-500' : theme.text}`}>
             {birthday.isToday ? 'NOW' : birthday.daysRemaining}
           </div>
           <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">
             {birthday.isToday ? 'Party!' : 'Days left'}
           </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center pl-3">
        <div className="text-sm text-gray-600 font-medium">
          Turning <span className="text-gray-900 font-bold">{birthday.ageTurning}</span>{getOrdinalSuffix(birthday.ageTurning)}
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={(e) => { e.stopPropagation(); setShowGifts(!showGifts); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${showGifts ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showGifts ? 'Hide Ideas' : 'Gift Ideas'}
          </button>

           <button 
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showGifts && (
        <div className="mt-4 pl-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Gift className="w-3 h-3" />
              Suggested Gifts
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((gift, i) => (
                <div key={i} className="bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100 text-center">
                  {gift}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Decorative colored bar on left */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${theme.accent}`}></div>
    </div>
  );
};