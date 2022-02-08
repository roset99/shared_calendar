import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { Families, People, Events } from './dbConnectors';

// SECRET
// const SECRET = "createaverystrongsec34!retthatalsoincludes2423412wdsa324e34e";

// || ========== Resolver Map ========== ||

// queries and mutations not currently in use have no auth, for dev use only

export const resolvers = { 
    Query: {
        getAllFamilies: async () => {
            return Families.find({})
                .populate({ path: 'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'attendees' }});
        },
        getOneFamily: async (root: any, { email }: any) => {
            const family = await Families.findOne({ email: email })
                .populate({ path: 'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'attendees' }});

            if (!family) { throw new UserInputError(`No family with email: ${email}`); }
            return family;
        },
        getFamilyById: async (root: any, args: any, { user }: any) => { // in use/requires user authorization
            // authorization
            if (!user) { throw new AuthenticationError("You are not logged in"); }

            // get family using id
            const family = await Families.findById(user.id)
                .populate({ path: 'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'attendees' }});

            if (!family) { throw new UserInputError(`No family with ID: ${user.id}`); }
            return family;
        },
        getAllPeople: async () => {
            return People.find({})
                .populate({ path: 'family', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'family' }});
        },
        getOnePerson: async (root: any, { id }: any) => {
            const person = await People.findById(id)
                .populate({ path: 'family', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'family' }});
            
            if (!person) { throw new UserInputError(`No person with ID: ${id}`); }
            return person;
        },
        getAllEvents: async () => {
            return Events.find({})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
        getOneEvent: async (root: any, { id }: any) => {
            const event = await Events.findById(id)
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});

            if (!event) { throw new UserInputError(`No event with ID: ${id}`); }
            return event;
        },
        getEventsByFamily: async (root: any, { family }: any) => {
            const event = await Events.find({family: family.id})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});

            if (!event) { throw new UserInputError(`No event with Family ID: ${family.id}`); }
            return event;
        },
    },
    Mutation: {
        login: async (root: any, { email, password }: ILogin, { SECRET }: any) => { // in use
            // see if family exists with email
            const user = await Families.findOne({ email: email });
            if (!user) { throw new UserInputError(`No family with email: ${email}`); }

            // check if password is correct
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) { throw new UserInputError("Incorrect password"); }

            // create and return token
            const token = jwt.sign(
                { 
                    user: { id: user.id }
                },
                SECRET,
                { expiresIn: "1h" } // is valid for 1 hour currently
            );

            return token;
        },
        register: async (root: any, { input }: any, { SECRET }: any) => { // in use
            // create family db object
            const newFamily = new Families({
                name: input.name,
                email: input.email,
                password: await bcrypt.hash(input.password, 12), // hash password
                members: input.members,
                events: input.events
            });

            newFamily.id = newFamily._id;

            // save to db and return family
            await newFamily.save();
            
            // create and return token
            const token = jwt.sign(
                { 
                    user: { id: newFamily.id }
                },
                SECRET,
                { expiresIn: "1h" } // is valid for 1 hour currently
            );

            return token;
        },
        updateFamily: async (root: any, { input }: any) => {
            // cannot update members and events with this
            const family = await Families.findOneAndUpdate({ _id: input.id }, input, { new: true });

            if (!family) { throw new UserInputError(`No family with ID: ${input.id}`); }
            return family;
        },
        deleteFamily: async (root: any, { id }: any) => {
            // get family to check 404
            const family = await Families.findById(id);
            if (!family) { throw new UserInputError(`No family with ID: ${id}`); }

            // delete family, members, events concurrently
            await Promise.all([
                Families.deleteOne({ _id: id }),
                People.deleteMany({ family: id }),
                Events.deleteMany({ family: id }),
            ]);

            return ('Successfully deleted family');
        },
        createPerson: async (root: any, { input }: any, { user }: any) => { // in use/requires user authorization
            // authorization
            if (!user) { throw new AuthenticationError("You are not logged in"); }
            const familyId = user.id;

            // check family id exists
            // currently only needed as jwt may not have expired
            const family = await Families.findById(familyId);
            if (!family) { throw new UserInputError(`No family with ID: ${familyId}`); }

            // create new person db object
            const newPerson = new People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: familyId
            });
            
            newPerson.id = newPerson._id;

            // save person in db and push to family.members
            await Promise.all([
                newPerson.save(),
                Families.updateOne({ _id: familyId }, { "$push": { "members": { _id: newPerson.id }}}),
            ]);

            // return person to be displayed
            return People.findById(newPerson.id)
                .populate({ path: 'family' });
        },
        updatePerson: async (root: any, { input }: any) => {
            // todo: validation for family and events (can or cannot change)
            const person = await People.findOneAndUpdate({ _id: input.id }, input, { new: true });
            if (!person) { throw new UserInputError(`No person with ID: ${input.id}`); }

            return People.findById(input.id)
                .populate({ path: 'family' }).populate({ path: 'events' });
        },
        deletePerson: async (root: any, { id }: any) => {
            // get person to check 404
            const person = await People.findById(id);
            if (!person) { throw new UserInputError(`No person with ID: ${id}`); }

            // delete person, from family.members, from events.attendees concurrently
            await Promise.all([
                People.deleteOne({ _id: id }),
                Families.updateOne({ "members": { "$in": id }}, { "$pull": { "members": id }}),
                Events.updateMany({ "attendees": { "$in": id }}, { "$pull": { "attendees": id }}),
            ]);

            return ('Successfully deleted person');
        },
        createEvent: async (root: any, { input }: any, { user }: any) => { // in use/requires user authorization
            // authorization
            if (!user) { throw new AuthenticationError("You are not logged in"); }
            const familyId = user.id;

            // check family id exists
            // currently only needed as jwt may not have expired
            const family = await Families.findById(familyId);
            if (!family) { throw new UserInputError(`No family with ID: ${familyId}`); }

            // create event db object using input
            const newEvent = new Events({
                title: input.title,
                family: familyId,
                attendees: [],
                date: input.date,
                startTime: input.startTime,
                endTime: input.endTime
            });

            for (const person of input.attendees) { newEvent.attendees.push(person.id); }

            newEvent.id = newEvent._id;

            // check all attendees are valid
            const people = await Promise.all(
                newEvent.attendees.map(async (personId) => {
                    return People.findById(personId);
                })
            );
            
            for (const i in people) {
                if (!people[i]) { throw new UserInputError(`No person with ID: ${newEvent.attendees[i]}`); }
            }

            // save event, add to family.events, add to people.events concurrently
            await Promise.all([
                newEvent.save(),
                Families.updateOne({ _id: familyId }, { "$push": { "events": { _id: newEvent.id }}}),
                People.updateMany({ _id: { "$in": newEvent.attendees }}, { "$push": { "events": { _id: newEvent.id }}}),
            ]);

            return Events.findById(newEvent.id)
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
        updateEvent: async (root: any, { input }: any) => {
            // this mutation needs much work

            // const oldEvent = await Events.findOneAndUpdate({ _id: input.id }, input, { new: false }, () => {});
            // const newEvent = await Events.findById(input.id, (err) => {});

            // const oldEvent = await Events.findById(input.id);
            await Events.findOneAndUpdate({ _id: input.id }, input);

            // const newEvent = await Events.findById(input.id);
            // const newEvent = await Events.findOneAndUpdate({ _id: input.id }, input, { new: true }, () => {});
          

            // get person and push updated event to their events list
            // for (let i=0; i < newEvent.attendees.length; i++) {

            //     // if person added to event
            //     const person = await People.findById(newEvent.attendees[i]);
                
            //     if (!person.events.includes(newEvent.id)) {
            //         person.events.push(newEvent.id)
            //         await People.updateOne({ _id: person.id }, person, { new: true }, () => {}) 
            //     }
            // }

            // for (let i=0; i < oldEvent.attendees.length; i++){
            //     // if newEvent !includes attendee, remove attendee 
            //     if (!newEvent.attendees.includes(oldEvent.attendees[i])) {
            //         const person = await People.findById(oldEvent.attendees[i])
            //         person.events.pull(oldEvent.id) // remove oldEvent from person's events array
            //         person.save()
            //     }
            // }
           
            return Events.findById(input.id, () => {})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});    
        },
        deleteEvent: async (root: any, { id }: any) => {
            // get event by id to check 404
            const event = await Events.findById(id);          
            if (!event) { throw new UserInputError(`No event with ID: ${id}`); }

            // delete event, from family.events, from people.events concurrently
            await Promise.all([
                Events.deleteOne({ _id: id }),
                Families.updateOne({ "events": { "$in": id } }, { "$pull": { "events": id }}),
                People.updateMany({ "events": { "$in": id }}, { "$pull": { "events": id }}),
            ]);

            return ('Successfully deleted event');
        },
    },
};

// || ========== Interfaces ========== ||

interface ILogin { // for login mutation input
    email: string,
    password: string
}