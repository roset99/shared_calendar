import React, { useState } from 'react';
import './MonthDayComponent.css';

const MonthDayComponent = ({day}: any) => {
    return(
        <div className="month-day">
            <h3 className="date"> {day} </h3>
            <p className="member">Person 1</p>
            <p className="member">Person 2</p>
            <p className="member">Person 3</p>
            <p className="member">Person 4</p>
        </div>
    )
}

export default MonthDayComponent;