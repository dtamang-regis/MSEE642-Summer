import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <header style={{
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'red' }}>Welcome to the Hiking Club</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'red' }}>
            Discover breathtaking trails, meet fellow adventurers, and experience the great outdoors
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link 
              to="/events" 
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              View Events
            </Link>
            <Link 
              to="/register" 
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              Join Now
            </Link>
          </div>
        </div>
      </header>

      <section className="container" style={{ padding: '3rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Join Our Club?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#2ecc71', marginBottom: '1rem' }}>🥾 Guided Hikes</h3>
            <p>Experience expert-led hikes on trails suitable for all skill levels</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#3498db', marginBottom: '1rem' }}>👥 Community</h3>
            <p>Connect with like-minded outdoor enthusiasts and build lasting friendships</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>🏔️ Adventure</h3>
            <p>Explore new trails and discover hidden gems in nature</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#f39c12', marginBottom: '1rem' }}>📚 Learning</h3>
            <p>Learn outdoor skills, safety techniques, and environmental stewardship</p>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#ecf0f1', padding: '3rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '2rem' }}>Upcoming Events</h2>
          <p style={{ marginBottom: '2rem' }}>Check out our scheduled hiking events and register today!</p>
          <Link to="/events" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Browse All Events
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
