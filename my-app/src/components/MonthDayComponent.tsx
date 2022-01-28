import React, { useEffect, useState } from 'react';
import './MonthDayComponent.css';

const MonthDayComponent = ({day, month, year, event}: any) => {
    const [attendeesList, setAttendeesList] = useState<any[]>([]);
    useEffect(() => {
        findAttendeesList();
    }, []);
    const findAttendeesList = (): void  => {
        const att: any[] = attendeesList;
        for (let e of event) {
            for (let a of e.attendees) {
                if (!(a in attendeesList)) {
                    att.push(a);
                }
            }
        }
        setAttendeesList(att);
    }
    // this isn't quite how to do it but currently can't access the entire family to test it
    const members = attendeesList.map((member) => {
        if (member in attendeesList) {
            return <p className="member event-true">{member.name}</p>
        } else {
            return <p className="member">{member.name}</p>
        }
    })

    return(
        <div className="month-day">
            <h3 className="date"> {day} </h3>
            {members}
        </div>
    )
}

export default MonthDayComponent;