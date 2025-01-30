import { useRef } from 'react';
import './homepage.css';
import BackgroundAnimation from '../components/backgroundAnimation';
import Button from '../components/button';
import Nav from '../components/nav';
import teamLogo from '../assets/gadget_labs.svg';

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
    <Nav/>
    <BackgroundAnimation 
      imageUrl={teamLogo}
      opacity={0.2}
      animationDuration={90} /*render speed*/
      patternSize={100}
    >
      <div className='content-homepage'>
        <div className="container" id="container" ref={containerRef}>
          <div className="form-container sign-up-container">
            <form action="#">
              <h1>Create Account</h1>
              <span>using organization email-id</span>
              <input type="text" placeholder="Name" required />
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <Button btntext='Sign Up' btntype='submit'/>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form action="#">
              <h1>Sign in</h1>
              <span>using your account</span>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <a href="#" className='forgot'>Forgot your password?</a>
              <Button btntext='Sign In' btntype='submit'/>  
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Already have an account?</h1>
                <p>Log into an existing account</p>
                <Button 
                btnclasses="ghost" 
                btnid="signIn" 
                btnclick={handleSignInClick}
                btntext='Sign In'/>
              </div>
            <div className="overlay-panel overlay-right">
              <h1>New User?</h1>
              <p>Sign Up using organization email account</p>
              <Button
              btnclasses="ghost"
              btnid="signUp" 
              btnclick={handleSignUpClick}
              btntext='Sign Up'/>
            </div>
          </div>
        </div>
      </div>
    </div>  
    </BackgroundAnimation>
    </>
  );
}

export default Sign;