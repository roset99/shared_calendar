import React, { useEffect } from 'react';
import { useState } from 'react';
import MonthDayComponent from './MonthDayComponent';
import './MonthlyCalendar.css';
import {Link, Route} from 'react-router-dom';
import {gql, useQuery} from '@apollo/client';
import DailyCalendar from './DailyCalendar';
import AddEvent from './AddEvent';


const GET_EVENTS = gql`
query GetEventsByFamily($family: FamilyInput){
    getEventsByFamily (family: $family){
         
        id
        family {
            id
            email
            members{
                name
                colour
                birthday
            }
        }
        attendees {
            name
            colour
        }
        date 
        startTime
        endTime
        title
    
    
    }
}`;
const GET_FAMILY = gql`
query GetFamilyById($id: ID){
    getFamilyById(id: $id){
        name
        email
        members{
            id
            name
            birthday
            colour
        }
        events{
            id
            attendees {
                name
                colour
            }
            date 
            startTime
            endTime
            title 
        }
    }
        

    }
`

const MonthlyCalendar = ({currentFamily}: any): any => {
    
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
    const [events, setEvents] = useState<any>([]);
    const [eventFormShow, setEventFormShow] = useState<boolean>(false);
    const [family, setFamily] = useState<any>(null);
    const [familyMembers, setFamilyMembers] = useState<any[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<any[]>(familyMembers);
    
    const [dateClicked, setDateClicked] = useState<string>("");
    const { loading, error, data, refetch } = useQuery(GET_FAMILY, {variables: {id: currentFamily.id}});
    
    
    
    const findFamilyMembers = () => {
        if (data !== null) {
            setFamilyMembers(data.getFamilyById.members);
        }
        
    }

    const filterMember = (member: any): void => {
        const index = filteredMembers.indexOf(member);
        const inbetween = filteredMembers.splice(index, 1);
        setFilteredMembers(inbetween);
    }

    const addFilteredMember = (member: any): void => {
        if (!filteredMembers.includes(member)){
           const inbetween = [member,...filteredMembers]
           setFilteredMembers(inbetween);
        }
        
    }

    useEffect(() => {
        if (!loading && !error){
            findFamilyMembers();
        }
    }, [data]);

    const getEvents = (): void => {
        if (!loading && !error ){
            setEvents(data.getFamilyById.events);
            console.log("this is data ", data.getFamilyById.events);
            
        }  
    }

    const onClickShowForm = () => {
        setEventFormShow(!eventFormShow);
    };

    const refreshEvents = (): void => {
        refetch();
        if (!loading && !error ){
            setEvents(data.getFamilyById.events);
            console.log("this is data ", data.getFamilyById.events);
            
        } 
    }

    const findCurrentMonthAndYear = (): number[] => {
        const d = new Date();
        return [d.getMonth(), d.getFullYear()];
    }

    const increaseMonth = () => {
        console.log(month);
        if (month === 11) {
            const newMonthIndex = 0;
            const newYear = year + 1;
            setYear(newYear);
            setMonth(newMonthIndex);   
            console.log(month);     
        } else {
            const newMonthIndex = month + 1;
            setMonth(newMonthIndex);
            console.log(newMonthIndex);
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



    const title = () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[month] + " " + year;
    }



    

    const monthDayComponents = daysInMonth.map((index) => {
        let monthFormat = "";
        let dayFormat = "";
        if (month < 10 ){
           const month1 = month + 1; 
           monthFormat = "0" + month1;
        } else {
            monthFormat = month.toString();
        } 
        if (index < 10 ){ 
            dayFormat = "0" + index;
         } else {
             dayFormat = index.toString();
         } 
        const date = dayFormat +"/" + monthFormat + "/" + year;
        let event: any[] = [];
        if (events === []) {
            return <Link className="days-of-month" to="/days" state={{date: date}}><MonthDayComponent day={index} month={month} year={year} event={event} key={index}/></Link>
        } else {
            for (let item of events) {
                
                if (item.date === date) {
                    console.log(item);
                    event.push(item);
                    console.log("data: ", item.date, "and ", "month date: ", date);
                    
                }
    
            }
            return <Link className="days-of-month" to="/days" state={{date: date}}><MonthDayComponent day={index} month={month} year={year} event={event} key={index}/></Link>
        }
       
        
                 
    });
    useEffect(() => {
        const thisMonthAndYear = findCurrentMonthAndYear();
        setMonth(thisMonthAndYear[0]);
        setYear(thisMonthAndYear[1]);
        allDaysInMonth(thisMonthAndYear[0], thisMonthAndYear[1]);
    }, []);
    useEffect(() => {
        allDaysInMonth(month, year);
    }, [month, year]);
    useEffect(() => {
        sessionStorage.setItem("events", JSON.stringify(events));
        console.log("this is session storage " + sessionStorage.getItem("events"));
    }, [events]);
    useEffect(() => {
        getEvents();
    }, [data]);
    if (loading) return <h1>loading...</h1>;
    else if (error) return <h1>Error! {error.message}</h1>;
    else { return (

        <div className="month-calendar">
            
            <div className="title">
                <button onClick={() => decreaseMonth()} className="button left-button"><i className="arrow left"></i></button>
                <h1>{title()}</h1>
                <button onClick={() => increaseMonth()} className = "button right-button"><i className="arrow right"></i></button>
            </div>
            <div className="month-day-components">
                {monthDayComponents}
            </div>
            <div className={eventFormShow ? "event-form form-show" : "event-form form-hidden"}>
                <AddEvent onClose={onClickShowForm} day={""} refreshEvents={refreshEvents} currentFamily={currentFamily} familyMembers={familyMembers}/>
            </div>
            <div className="float" onClick={() => onClickShowForm()}>
                <i className="fa fa-plus my-float"></i>
            </div>
            
            

            
        </div>
        
        
    )};
    
}

export default MonthlyCalendar;