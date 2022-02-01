import React, { useEffect, useState } from 'react';
import { isNamedExports } from 'typescript';
import './MonthDayComponent.css';

const MonthDayComponent = ({day, month, year, event}: any) => {
    const [attendeesList, setAttendeesList] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    
    const findAttendeesList = ()  => {
            // console.log("start findAttendeesList attendeesList: ", attendeesList);
            // console.log(attendeesList.map(d => d.name));
            for (let e of event) {
                console.log("component date: ", e.date);
                for (let a of e.attendees) {
                    if (!attendeesList.map(d => d.name).includes(a.name)) {
                        console.log(a.name);
                        attendeesList.push(a);
                    }
                }
            }
            setMembers(attendeesList.map((member, index) => {
            console.log("this is the attendees ", attendeesList)
            const colourList = ["ffadad",
                "ffd6a5",
                "fdffb6",
                "caffbf",
                "a0c4ff",
                "bdb2ff",
                "ffc6ff"];
            if (attendeesList.includes(member)) {
                let classColour = "";
                console.log(member.colour)
                for (let i = 0; i < 7; i++){
                    if (colourList[i] === member.colour) {
                        classColour = "member event-true colour-" + member.colour;    
                    }
                }
            return <p className={classColour} key={index}>{member.name}</p>;    
            } else {
                return <p className="member" key={index}>{member.name}</p>
            }
            }));
        
    }
    useEffect(() => {
        findAttendeesList();
    }, [event]);
    // this isn't quite how to do it but currently can't access the entire family to test it
    

    return(
        <div className="month-day">
            <h3 className="date"> {day} </h3>
            {/* <p>{events.</p> */}
            <div className="members-events-list">
                {members}
            </div>
            
        </div>
    )
}

export default MonthDayComponent;