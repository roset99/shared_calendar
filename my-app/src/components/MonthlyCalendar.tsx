import React from 'react';
import { useState, useEffect } from 'react';
import MonthDayComponent from './MonthDayComponent';
import './MonthlyCalendar.css';
import {Link} from 'react-router-dom';
import {gql useQuery} from '@apollo/client';

const GET_EVENTS = gql`
query GetAllEvents {
    events { 
        id
        family
        owner
        attendees
        date 
        time
    }
}`;

const MonthlyCalendar = (): any => {
    

    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
    const { loading, error, data } = useQuery(GET_EVENTS);

    if (loading) return 'loading...';
    if (error) return 'Error! ${error.message}';

    const findCurrentMonthAndYear = (): number[] => {
        const d = new Date();
        return [d.getMonth(), d.getFullYear()];
    }

    const increaseMonth = async () => {
        console.log(month);
        if (month === 11) {
            const newMonthIndex = await 0;
            const newYear = year + 1;
            setYear(newYear);
            setMonth(newMonthIndex);   
            console.log(month);     
        } else {
            const newMonthIndex = await month + 1;
            setMonth(newMonthIndex);
            console.log(month);
        }
        
    }

    

    const decreaseMonth = () => {
        if (month === 0) {
            const newMonthIndex = 11;
            setYear(year - 1);
            setMonth(newMonthIndex);  
            console.log(month);      
        } else {
            const newMonthIndex = month - 1 ;
            setMonth(newMonthIndex);
            console.log(month);
        }
        // allDaysInMonth(month, year);

    }

    function allDaysInMonth (month1: number, year1: number): number[] {
        const lastDay: number = new Date(year1, month1 + 1, 0).getDate();
        console.log("This is the month: ", month, "this is the days: ", lastDay);
        console.log(new Date(2022, 12, 0).getDate())
        const array = [];
        for (let i: number=1; i < lastDay + 1; i++){
            array.push(i);
        }
        setDaysInMonth(array);
        return array;
    }
    useEffect(() => {
        allDaysInMonth(month, year);
    }, [month, year]);

    const title = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[month] + " " + year;
    }

    useEffect(() => {
        const thisMonthAndYear = findCurrentMonthAndYear();
        setMonth(thisMonthAndYear[0]);
        setYear(thisMonthAndYear[1]);
        allDaysInMonth(thisMonthAndYear[0], thisMonthAndYear[1]);
    }, [])

    const monthDayComponents = daysInMonth.map((index) => {
        return <Link className="days-of-month" to="/days"><MonthDayComponent day={index} month={month} year={year} key={index}/></Link>
                 
    });

    return (
        <div className="month-calendar">
            <div className="title">
                <button onClick={() => decreaseMonth()} className="button left-button"><i className="arrow left"></i></button>
                <h1>{title()}</h1>
                <button onClick={() => increaseMonth()} className = "button right-button"><i className="arrow right"></i></button>
            </div>
            <div className="month-day-components">
                {monthDayComponents}
            </div>
            
        </div>
        
    )
}

export default MonthlyCalendar;