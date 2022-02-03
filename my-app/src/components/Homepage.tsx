import React from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import SignUp from './Signup';
import { Link} from 'react-router-dom'

interface Props {
  currentFamily: any
}

function Homepage({currentFamily}: Props): JSX.Element {

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
}

  return (
    <section id="hp">
      <h1 id="hp-header">SHARED CALENDAR</h1>
      {(currentFamily) ? 
      <>
        <p>Logged In</p>
        <Link className="month-calendar" to="/month-calendar">Calendar Placeholder</Link>
        <button onClick={handleLogout}>Logout</button>

      </> :
      <>
        <Link className="hp-signup" to="/signup">Sign Up</Link>
        <Link className="hp-login" to="/login">Login</Link>
      </>
      }
    </section>
  );
}

export default Homepage;
