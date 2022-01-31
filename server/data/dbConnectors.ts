import { Schema, model, connect, Types } from 'mongoose';

// || ========== Mongo connection ========== ||

// -- old connection
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/calendar', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// -- new connection
main().catch(err => console.log(err));
async function main(): Promise<void> {
    await connect('mongodb://localhost/calendar', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

// || ========== Schemas and Interfaces ========== ||

export interface Family {
    email: string;
    password: string;
    members: Types.ObjectId[];
    events: Types.ObjectId[];
}

const familySchema = new Schema<Family>({
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
    family: Types.ObjectId;
    owner: Types.ObjectId;
    attendees: Types.ObjectId[];
    date: string;
    time: string;
}

const eventSchema = new Schema<Event>({
    family: { type: Types.ObjectId, ref: 'families' },
    owner: { type: Types.ObjectId, ref: 'people' },
    attendees: [{ type: Types.ObjectId, ref: 'people' }],
    date: { type: String },
    time: { type: String }
});

// || ========== Models ========== ||

const Families = model<Family>('families', familySchema);
const People = model<Person>('people', personSchema);
const Events = model<Event>('events', eventSchema);

export { Families, People, Events };