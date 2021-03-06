import React, {  useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DailyCalendar.css';

const DailyCalendar = () => {
    const eventsTest = [{title: "Teeth", date: "01/01/2022", startTime: "09:00", endTime: "11:00"}];
    const peopleTest = [{name:"steve"}, {name:"ellie"}];
    let location: any = useLocation();
    const [date, setDate] = useState("");
    const [events, setEvents] = useState<any>([]);
    const [eventFormShow, setEventFormShow] = useState<boolean>(false);
    const [members, setMembers] = useState<any>([]);

    useEffect(() => {
        setDate(location.state.date);
        const eventDataString = sessionStorage.getItem("events");
        
        console.log("this is event data ", eventDataString);
        if (eventDataString !== null ) {
            setEvents(JSON.parse(eventDataString) );
            }
            console.log("this is family members: ", location.state.familyMembers);
        if (location.state.familyMembers !== []){
            setMembers(location.state.familyMembers);
        }
           
               
    }, []);

    useEffect(() => {
        console.log("this is events in dailycalendar: ", events);
    }, [events]);
    
    const onClickShowForm = () => {
        setEventFormShow(!eventFormShow);
    };

    const attendeeList = members.map( (person: any) => {
        console.log("this is person: ", person);
    const eventsList = events.map((item : any) => {
        if (item.date === date && item.attendees.map((att: any) => {return att.name}).includes(person.name)){
            return(
                <p>{item.startTime + " - " + item.endTime + ": " + item.title} </p>
            )
        }
    })    
    return(
        <div className="member-event-list">
            <h3>{person.name}</h3>
            {eventsList}
        </div>
        
        )
    });

    

    return (
        <div>
            <h1 id="daily-date-title">{location.state.date}</h1>
            <section className="event-lists">
                {attendeeList}
            </section>
            <div className={eventFormShow ? "event-form show" : "event-form hidden"}>

            </div>
            <div className="float" onClick={() => onClickShowForm()}>
                <i className="fa fa-plus my-float"></i>
            </div>
        </div>
    )
};
export default DailyCalendar;