const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '2rem 0',
      marginTop: 'auto',
      textAlign: 'center'
    }}>
      <div className="container">
        <p>&copy; 2024 Hiking Club. All rights reserved.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Explore nature, build friendships, create memories.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
