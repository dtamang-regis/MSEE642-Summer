const About = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="card">
        <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>About the Hiking Club</h1>
        
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#3498db', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ lineHeight: '1.8' }}>
            The Hiking Club was founded with a simple mission: to bring together outdoor enthusiasts 
            of all skill levels to explore nature's beauty, promote physical fitness, and foster a 
            sense of community among hikers. We believe that everyone deserves the opportunity to 
            experience the transformative power of nature.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#3498db', marginBottom: '1rem' }}>Our History</h2>
          <p style={{ lineHeight: '1.8' }}>
            Established in 2015, our club has grown from a small group of friends hiking local trails 
            to a vibrant community of hundreds of members. Over the years, we've organized hundreds 
            of hikes, from easy nature walks to challenging mountain expeditions. After a challenging 
            period following a security incident, we've rebuilt our platform with enhanced security 
            measures to better serve our members.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#3498db', marginBottom: '1rem' }}>What We Offer</h2>
          <ul style={{ lineHeight: '2' }}>
            <li>Weekly guided hikes at various difficulty levels</li>
            <li>Monthly workshops on outdoor skills and safety</li>
            <li>Annual hiking challenges and competitions</li>
            <li>Social events and community gatherings</li>
            <li>Access to exclusive trail maps and resources</li>
            <li>Discounts at partner outdoor gear stores</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#3498db', marginBottom: '1rem' }}>Our Leadership Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Sarah Johnson</h3>
              <p style={{ color: '#666' }}>Club President</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Michael Chen</h3>
              <p style={{ color: '#666' }}>Trail Coordinator</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Emily Rodriguez</h3>
              <p style={{ color: '#666' }}>Safety Officer</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>David Thompson</h3>
              <p style={{ color: '#666' }}>Events Manager</p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ color: '#3498db', marginBottom: '1rem' }}>Safety Guidelines</h2>
          <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
            Your safety is our top priority. All participants must adhere to the following guidelines:
          </p>
          <ul style={{ lineHeight: '2' }}>
            <li>Always hike with a partner or group</li>
            <li>Carry adequate water, food, and emergency supplies</li>
            <li>Wear appropriate footwear and clothing for weather conditions</li>
            <li>Inform someone of your hiking plans and expected return time</li>
            <li>Stay on marked trails and respect wildlife</li>
            <li>Follow the instructions of hike leaders at all times</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
