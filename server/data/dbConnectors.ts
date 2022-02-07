import { Schema, model, connect, Types } from 'mongoose';

// || ========== Mongo connection ========== ||

main().catch(err => console.log(err));
async function main(): Promise<void> {
    await connect('mongodb://localhost/calendar', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

// || ========== Schemas and Interfaces ========== ||

export interface Family {
    name: string;
    email: string;
    password: string;
    members: Types.ObjectId[];
    events: Types.ObjectId[];
}

const familySchema = new Schema<Family>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    members: [{ type: Types.ObjectId, ref: 'people' }],
    events: [{ type: Types.ObjectId, ref: 'events' }]
});

interface Person {
    name: string;
    birthday: string;
    events: Types.ObjectId[];
    colour: string;
    family: Types.ObjectId;
}

const personSchema = new Schema<Person>({
    name: { type: String },
    birthday: { type: String },
    events: [{ type: Types.ObjectId, ref: 'events' }],
    colour: { type: String },
    family: { type: Types.ObjectId, ref: 'families' }
});

interface Event {
    title: string;
    family: Types.ObjectId;
    attendees: Types.ObjectId[];
    date: string;
    startTime: string;
    endTime: string;
}

const eventSchema = new Schema<Event>({
    title: { type: String },
    family: { type: Types.ObjectId, ref: 'families' },
    attendees: [{ type: Types.ObjectId, ref: 'people' }],
    date: { type: String },
    startTime: { type: String },
    endTime: { type: String }
});

// || ========== Models ========== ||

const Families = model<Family>('families', familySchema);
const People = model<Person>('people', personSchema);
const Events = model<Event>('events', eventSchema);

export { Families, People, Events };