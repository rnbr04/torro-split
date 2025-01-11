import { useRef } from 'react';
import './homepage.css';

function Sign() {
  const containerRef = useRef(null);

  const handleSignUpClick = () => {
    containerRef.current.classList.add('right-panel-active');
  };

  const handleSignInClick = () => {
    containerRef.current.classList.remove('right-panel-active');
  };

  return (
    <>
      <div className="container" id="container" ref={containerRef}>
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <span>using organization email-id</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <span>using your account</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot your password?</a>
            <button>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sign;