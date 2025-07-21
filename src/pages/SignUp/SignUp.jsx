import React from 'react';
import SignUpForm from "../../components/auth/SignUpForm";

const SignUp = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        margin: 0,            
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          width: '400px',
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/koundary_logo.png"
            alt="Koundary Logo"
            style={{ width: '220px', objectFit: 'contain' }}
          />
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
