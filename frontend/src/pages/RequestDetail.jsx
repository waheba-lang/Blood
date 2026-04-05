import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../utils/axios';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

export default function RequestDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    // Fetch request details and comments in parallel
    Promise.all([
      axios.get(`/requests/${id}`),
      axios.get(`/requests/${id}/comments`)
    ])
      .then(([reqRes, comRes]) => {
        setRequest(reqRes.data);
        setComments(comRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/requests/${id}/comments`, { body: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDonate = async () => {
    if (!user) {
      alert(t('request_detail.donate_alert'));
      return;
    }
    
    try {
      await axios.post('/donations', { donation_request_id: id });
      alert(t('request_detail.donate_success'));
    } catch (err) {
      console.error(err);
      alert(t('request_detail.donate_error'));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('common.loading')}</div>;
  if (!request) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('request_detail.not_found')}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', textAlign: isRtl ? 'right' : 'left' }}>
      <Link to="/requests" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        {isRtl ? '→' : '←'} {t('request_detail.back')}
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '2rem', marginBottom: '2rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>{t('request_detail.title', { name: request.patient_name })}</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('request_detail.posted_by')} <Link to={`/users/${request.user_id}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{request.user.name}</Link>
            </p>
          </div>
          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #ff4d6d 100%)', 
              color: 'white', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '12px', 
              fontWeight: 900, 
              fontSize: '1.5rem',
              boxShadow: '0 8px 20px rgba(230, 57, 70, 0.2)'
            }}>
              {request.blood_type}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem', textAlign: isRtl ? 'right' : 'left' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{t('my_requests.hospital')}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{request.hospital}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{t('home.filters.city')}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{request.city}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{t('my_requests.urgency')}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: request.urgency === 'Critical' || request.urgency === 'Urgent' ? 'var(--primary)' : 'inherit' }}>
              {t(`new_request_form.urgency.${request.urgency.toLowerCase()}`)}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{t('my_requests.quantity')}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{request.quantity} {t('my_requests.units')}</p>
          </div>
        </div>

        {request.contact_note && (
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', borderLeft: isRtl ? 'none' : '4px solid var(--primary)', borderRight: isRtl ? '4px solid var(--primary)' : 'none' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-dark)' }}>"{request.contact_note}"</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleDonate} className="btn btn-primary" style={{ flex: 1, padding: '1.2rem', fontSize: '1.1rem' }}>{t('request_detail.donate_btn')}</button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>{t('request_detail.discussion')} ({comments.length})</h3>

        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '2.5rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('request_detail.comment_placeholder')}
              required
              className="form-control"
              style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}
            />
            <button type="submit" className="btn btn-primary" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>{t('request_detail.comment_btn')}</button>
          </form>
        ) : (
          <p style={{ margin: '1.5rem 0', textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
            {t('request_detail.login_to_comment').split(t('nav.login')).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <Link to="/login" style={{ fontWeight: 700, color: 'var(--primary)' }}>{t('nav.login')}</Link>}
              </span>
            ))}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <Link to={`/users/${comment.user.id}`} style={{ fontWeight: 800, color: 'var(--text-dark)', textDecoration: 'none' }}>
                  {comment.user.name} <span style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.85rem' }}>({comment.user.role})</span>
                </Link>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(comment.created_at).toLocaleDateString(isRtl ? 'ar-MA' : 'fr-FR')}
                </span>
              </div>
              <p style={{ color: 'var(--text-dark)', lineHeight: 1.6 }}>{comment.body}</p>
            </div>
          ))}
          {comments.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{t('request_detail.no_comments')}</p>}
        </div>
      </div>
    </div>
  );
}

