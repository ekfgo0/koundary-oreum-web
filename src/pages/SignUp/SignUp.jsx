import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from "../../components/auth/SignUpForm";

const SignUp = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',   // 주축 방향으로 아이템들을 어떻게 정렬할지 결정
        alignItems: 'center',       // 교차축 방향으로 아이템들을 어떻게 정렬할지 결정
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
          boxShadow: 'none',
          border: 'none',
        }}
      >
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '2rem' 
        }}>
          <Link to="/login" style={{ 
            textDecoration: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <img
              src="/koundary_logo.png"
              alt="Koundary Logo"
              style={{ 
                width: '220px', 
                objectFit: 'contain',
                cursor: 'pointer',
                display: 'block'
              }}
            />
          </Link>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;