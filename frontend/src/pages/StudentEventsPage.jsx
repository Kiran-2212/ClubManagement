import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

export default function StudentEventsPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [feedbackForms, setFeedbackForms] = useState({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadData = async () => {
    try {
      const [eventResponse, registrationResponse, feedbackResponse] = await Promise.all([
        api.get('/events'),
        api.get('/student/events'),
        api.get('/student/feedback'),
      ]);
      setEvents(eventResponse.data);
      setRegistrations(registrationResponse.data);
      setFeedback(feedbackResponse.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load events');
    }
  };

  useEffect(() => { loadData(); }, []);

  const register = async (eventId) => {
    setError('');
    setNotice('');
    try {
      const { data } = await api.post(`/events/${eventId}/register`);
      setRegistrations((current) => [...current, data]);
      setNotice('Registered successfully.');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const submitFeedback = async (eventId) => {
    const form = feedbackForms[eventId] || { rating: 5, comment: '' };
    setError('');
    setNotice('');
    try {
      const { data } = await api.post(`/events/${eventId}/feedback`, form);
      setFeedback((current) => [...current, data]);
      setNotice('Feedback submitted.');
    } catch (err) {
      setError(err.message || 'Unable to submit feedback');
    }
  };

  const registeredEventIds = new Set(registrations.map((registration) => registration.event?.id));
  const feedbackEventIds = new Set(feedback.map((item) => item.event?.id));

  return (
    <Layout title="Events">
      {error && <p className="error-box" role="alert">{error}</p>}
      {notice && <p className="success-box" role="status">{notice}</p>}
      <div className="list">
        {events.map((event) => (
          <div className="list-item" key={event.id}>
            <div className="row">
              <div>
                <h3>{event.title}</h3>
                <p>{event.club?.name} · {event.date} at {event.time} · {event.venue}</p>
              </div>
              {registeredEventIds.has(event.id)
                ? <span className="badge">Registered</span>
                : <button className="primary" type="button" onClick={() => register(event.id)}>Register</button>}
            </div>
            <p>{event.description}</p>
            {registeredEventIds.has(event.id) && (
              feedbackEventIds.has(event.id)
                ? <p className="success-box">Feedback submitted</p>
                : <form onSubmit={(e) => { e.preventDefault(); submitFeedback(event.id); }}>
                    <label>Rating
                      <select value={feedbackForms[event.id]?.rating || 5} onChange={(e) => setFeedbackForms((current) => ({
                        ...current,
                        [event.id]: { ...(current[event.id] || { comment: '' }), rating: Number(e.target.value) },
                      }))}>
                        {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
                      </select>
                    </label>
                    <label>Feedback
                      <textarea value={feedbackForms[event.id]?.comment || ''} onChange={(e) => setFeedbackForms((current) => ({
                        ...current,
                        [event.id]: { ...(current[event.id] || { rating: 5 }), comment: e.target.value },
                      }))} />
                    </label>
                    <button className="secondary" type="submit">Submit Feedback</button>
                  </form>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}
