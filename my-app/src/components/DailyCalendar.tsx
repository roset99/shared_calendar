import React from 'react';

const DailyCalendar = () => {
    const range=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
    const events = [{title: "Teeth", date: "01/01/2022", startTime: "09:00", endTime: "11:00"}]
    const hourIncrements = range.map((hour) => {
        let hourIncrement = "00:00";
        if (hour < 10){
            hourIncrement = "0" + hour + ":00";
        } else {
            hourIncrement = hour + ":00";
        }
        const eventsList = events.map( event => {
            if (event.startTime === hourIncrement) {
                return <div >{event.title}</div>
            }
        })
        
        return (
            <div className={"hour-" + hourIncrement}>
                <h3>{hourIncrement}</h3>
                {eventsList}
            </div>
        )
    })
    return (
        <div>
            <h1>January 1st 2022</h1>
            <section>
                {hourIncrements}
            </section>
        </div>
    )
}
export default DailyCalendar;