import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';

const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, {
  weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
}) : 'Date to be announced';

export default function StudentEventsPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [feedbackForms, setFeedbackForms] = useState({});
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const register = async (eventId) => {
    setError('');
    setNotice('');
    try {
      const { data } = await api.post(`/events/${eventId}/register`);
      setRegistrations((current) => [...current, data]);
      setNotice('Your registration is confirmed.');
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
      setNotice('Thanks for sharing your feedback.');
    } catch (err) {
      setError(err.message || 'Unable to submit feedback');
    }
  };

  const registeredEventIds = new Set(registrations.map((registration) => registration.event?.id));
  const feedbackEventIds = new Set(feedback.map((item) => item.event?.id));

  return (
    <Layout title="Events">
      <section className="student-page-intro">
        <div><p className="student-kicker">WHAT’S HAPPENING</p><h2>Campus events</h2></div>
        <p>Find a gathering, workshop, or activity hosted by your campus clubs.</p>
      </section>

      <div className="student-list-toolbar">
        <span>{loading ? 'Loading events…' : `${events.length} ${events.length === 1 ? 'event' : 'events'}`}</span>
        <span className="student-muted">Open to all students</span>
      </div>
      {error && <p className="student-feedback-message" role="alert">{error}</p>}
      {notice && <p className="student-feedback-message" role="status">{notice}</p>}
      {!loading && !error && events.length === 0 && (
        <div className="student-empty student-empty-panel"><strong>No events are listed right now</strong><span>Check back soon, or explore clubs to find a community.</span><Link className="student-button" to="/student/clubs">Browse clubs</Link></div>
      )}

      <div className="student-event-list">
        {events.map((event) => {
          const isRegistered = registeredEventIds.has(event.id);
          const hasFeedback = feedbackEventIds.has(event.id);
          const registrationClosed = ['CANCELLED', 'COMPLETED'].includes(event.status);
          return (
            <article className="student-event-card" key={event.id}>
              <div className="student-event-date"><span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span><strong>{new Date(event.date).toLocaleDateString(undefined, { day: '2-digit' })}</strong></div>
              <div className="student-event-content">
                <div className="student-event-heading">
                  <div><p className="student-kicker">{event.club?.name || 'CAMPUS EVENT'}</p><h3>{event.title}</h3></div>
                  {event.status && <span className="student-status">{event.status}</span>}
                </div>
                <p className="student-event-description">{event.description || 'Join your campus community for this event.'}</p>
                <div className="student-event-meta"><span>{formatDate(event.date)}</span><span>{event.time || 'Time to be announced'}</span><span>{event.venue || 'Venue to be announced'}</span></div>

                {isRegistered ? (
                  <div className="student-event-registration">
                    <span className="student-status">You’re registered</span>
                    {hasFeedback ? <p className="student-muted">Feedback submitted</p> : (
                      <form className="student-feedback-form" onSubmit={(e) => { e.preventDefault(); submitFeedback(event.id); }}>
                        <label>Rate this event
                          <select value={feedbackForms[event.id]?.rating || 5} onChange={(e) => setFeedbackForms((current) => ({
                            ...current,
                            [event.id]: { ...(current[event.id] || { comment: '' }), rating: Number(e.target.value) },
                          }))}>
                            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
                          </select>
                        </label>
                        <label>Your feedback
                          <textarea placeholder="What did you think?" value={feedbackForms[event.id]?.comment || ''} onChange={(e) => setFeedbackForms((current) => ({
                            ...current,
                            [event.id]: { ...(current[event.id] || { rating: 5 }), comment: e.target.value },
                          }))} />
                        </label>
                        <button className="student-button" type="submit">Submit feedback</button>
                      </form>
                    )}
                  </div>
                ) : registrationClosed ? (
                  <span className="student-muted">Registration is closed</span>
                ) : (
                  <button className="student-button" type="button" onClick={() => register(event.id)}>Register for event <span aria-hidden="true">→</span></button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Layout>
  );
}
