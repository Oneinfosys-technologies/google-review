import React, { useState } from 'react';
import { StarRating } from './components/StarRating';
import { supabase } from './lib/supabase';
import { MessageSquareHeart } from 'lucide-react';

function App() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = async (newRating: number) => {
    setRating(newRating);
    
    if (newRating >= 4) {
      const businessPlaceId = 'YOUR_GOOGLE_PLACE_ID';
      const templateMessage = encodeURIComponent('I had a great experience!');
      window.location.href = `https://search.google.com/local/writereview?placeid=${businessPlaceId}&review=${templateMessage}`;
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('feedback')
        .insert([{ rating, message }]);

      if (supabaseError) throw supabaseError;

      setStatus('success');
      setMessage('');
      setRating(0);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
            <p className="text-gray-600 text-lg">Your feedback helps us improve and serve you better.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageSquareHeart className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Feedback
          </h1>
          <p className="text-gray-600 text-lg">
            Your opinion matters to us
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              How was your experience with us?
            </label>
            <div className="flex justify-center">
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
          </div>

          {rating > 0 && rating <= 3 && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                How can we improve?
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your feedback helps us improve..."
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
              {error}
            </div>
          )}

          {rating > 0 && rating <= 3 && (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-lg font-medium"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;