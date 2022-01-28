import React from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import SignUp from './Signup';

import { Link } from 'react-router-dom'

function Homepage(): JSX.Element {
  return (
    <section id="hp">
      <h1 id="hp-header">SHARED CALENDAR</h1>
      <Link className="hp-signup" to="/signup">Sign Up</Link>
      <Link className="hp-login" to="/login">Login</Link>
      <Link className="hp-events" to="/events">Events placeholder</Link> 
      <Link className="month-calendar" to="/month-calendar">Calendar Placeholder</Link>
    </section>
  );
}

export default Homepage;
