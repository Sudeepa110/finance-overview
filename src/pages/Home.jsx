// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './Home.css'; // Make sure to create this file

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="text-center text-lg-start">
              <h1 className="display-4 fw-bold mb-4">Welcome to Finance Overview</h1>
              <p className="lead mb-4">Your easy-to-use platform for managing lending and borrowing transactions with confidence and clarity.</p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Button size="lg" variant="primary" as={Link} to="/signup">
                  Get Started
                </Button>
                <Button size="lg" variant="outline-secondary" as={Link} to="/dashboard">
                  View Demo
                </Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="hero-image">
                <img src="/api/placeholder/500/400" alt="Finance management" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <Container>
          <h2 className="text-center mb-5">Powerful Features</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 feature-card">
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-graph-up-arrow"></i>
                  </div>
                  <Card.Title className="mb-3">Quick Overview</Card.Title>
                  <Card.Text>Get a comprehensive summary of your total lending portfolio and outstanding balances at a glance.</Card.Text>
                  <Button variant="link" as={Link} to="/dashboard" className="mt-auto">
                    Learn more
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 feature-card">
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-people"></i>
                  </div>
                  <Card.Title className="mb-3">Manage Borrowers</Card.Title>
                  <Card.Text>Track loans, repayments, and borrower details with an intuitive and organized interface.</Card.Text>
                  <Button variant="link" as={Link} to="/borrowers" className="mt-auto">
                    Learn more
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 feature-card">
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-bar-chart"></i>
                  </div>
                  <Card.Title className="mb-3">Reports & Analytics</Card.Title>
                  <Card.Text>View detailed reports on lending trends, interest earned, and performance metrics.</Card.Text>
                  <Button variant="link" as={Link} to="/reports" className="mt-auto">
                    Learn more
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 className="mb-4">Ready to start managing your finances?</h2>
              <p className="lead mb-4">Join thousands of users who are already streamlining their lending and borrowing processes.</p>
              <Button size="lg" variant="primary" as={Link} to="/signup">
                Create Your Account
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;