import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

import { Families, People, Events } from './dbConnectors';

// SECRET
// const SECRET = "createaverystrongsec34!retthatalsoincludes2423412wdsa324e34e";

// || ========== Resolver Map ========== ||

export const resolvers = { 
    Query: {
        getAllFamilies: async () => {
            return Families.find({})
                .populate({ path: 'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'attendees' }});
        },
        getOneFamily: async (root: any, { email }: any) => {
            return Families.findOne({ email: email })
                .populate({ path: 'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'attendees' }});
        },
        getFamilyById: async (root: any, { id }: any) => {
            return Families.findById(id)
                .populate({ path: 'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'attendees' }});
        },
        getAllPeople: async () => {
            return People.find({})
                .populate({ path: 'family', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'family' }});
        },
        getOnePerson: async (root: any, { id }: any) => {
            return People.findById(id)
                .populate({ path: 'family', populate: { path: 'events' }})
                .populate({ path: 'events', populate: { path: 'family' }});
        },
        getAllEvents: async () => {
            return Events.find({})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
        getOneEvent: async (root: any, { id }: any) => {
            return Events.findById(id)
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
        getEventsByFamily: async (root: any, { family }: any) => {
            return Events.find({family: family.id})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
    },
    Mutation: {
        login: async (root: any, { email, password }: ILogin) => {
            const user = await Families.findOne({ email: email });
            if (!user) { throw new Error("Family not found") };

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) { throw new Error("Incorrect password") };

            // const token = jwt.sign(
            //     { 
            //         user: { id: user.id }
            //     },
            //     SECRET,
            //     { expiresIn: "1d" }
            // );

            // return token;

            return user.id;
        },

        createFamily: async (root: any, { input }: any) => {
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
            newFamily.save();
            return newFamily // no populate as family will not contain members/events at this point
        },
        updateFamily: async (root: any, { input }: any) => {
            // cannot update members and events with this
            return Families.findOneAndUpdate({ _id: input.id }, input, { new: true }) 
        },
        deleteFamily: async (root: any, { id }: any) => {
            // get family from db with id
            const family = await Families.findById(id);
            if (!family) {
                throw new Error
            }

            // delete people in family.members
            for (let i = 0; i < family.members.length; i++){
                const personId = family.members[i]
                await People.deleteOne({ _id: personId })
            }
        
            // delete events in family.events
            for (let i = 0; i < family.events.length; i++){
                const eventId = family.events[i]
                await Events.deleteOne({ _id: eventId })
            }
            
            // delete family from db
            await Families.deleteOne({ _id: id });
            return ('Succesfully deleted family');
        },
        createPerson: async (root: any, { input }: any) => {
            // create new person db object and save in database
            const newPerson = new People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: input.family.id
            });
            
            newPerson.id = newPerson._id;

            newPerson.save();

            // push person.id to family.members
            // (could potentially use findOneAndUpdate as this also returns family)
            const familyId = newPerson.family;
            await Families.updateOne({ _id: familyId }, { "$push": { "members": { _id: newPerson.id }}});

            // return person to be displayed
            return People.findById(newPerson.id)
                .populate({ path: 'family' });
        },
        updatePerson: async (root: any, { input }: any) => {
            // todo: validation for family and events (can or cannot change)
            await People.findOneAndUpdate({ _id: input.id }, input, { new: true });

            return await People.findById(input.id)
                .populate({ path: 'family' }).populate({ path: 'events' });
        },
        deletePerson: async (root: any, { id }: any) => {
            // get person from db
            const person = await People.findById(id);
            if (!person) {
                return ('Person not found');
            }

            // remove person from events attendees
            for (let i = 0; i < person.events.length; i++) {
                const eventId = person.events[i];
                await Events.updateOne({ _id: eventId }, { "$pull": { "attendees": person.id }});
            }

            // remove person from family.members
            const familyId = person.family;
            await Families.updateOne({ _id: familyId }, { "$pull": { "members": person.id }});

            // delete person
            await People.deleteOne({ _id: id });

            return ('Successfully deleted person');
        },
        createEvent: async (root: any, { input }: any) => {
            // create event db object using input
            const newEvent = new Events({
                title: input.title,
                family: input.family.id,
                attendees: [],
                date: input.date,
                startTime: input.startTime,
                endTime: input.endTime
            });

            newEvent.id = newEvent._id;           

            // loop through input.attendees
            for (let i = 0; i < input.attendees.length; i++) {
                const personId: any = input.attendees[i].id;

                // add event.id to person.events
                await People.updateOne({ _id: personId }, { "$push": { "events": { _id: newEvent.id }}});

                // add person id to event attendees
                newEvent.attendees.push(personId);  
            }

            // save event to database
            await newEvent.save();

            // add event to family.events
            const familyId = newEvent.family;
            await Families.updateOne({ _id: familyId }, { "$push": { "events": { _id: newEvent.id }}});

            return Events.findById(newEvent.id)
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
        updateEvent: async (root: any, { input }: any) => {
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
           
            return await Events.findById(input.id, () => {})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});    
        },
        deleteEvent: async (root: any, { id }: any) => {
            // get event from database by id
            const event = await Events.findById(id);          
            if (!event) {
                throw new Error("Error");
            }

            // delete event from db
            await Events.deleteOne({ _id: id });

            // remove event form family.events
            const familyId = event.family;
            await Families.updateOne({ _id: familyId }, { "$pull": { "events": event.id }});

            // remove from person.events
            for (let i = 0; i < event.attendees.length; i++) {
                const personId = event.attendees[i];
                await People.updateOne({ _id: personId }, { "$pull": { "events": event.id }});
            } 
            
            return ('Successfully deleted event');
        },
    },
};

// || ========== Interfaces ========== ||

interface ILogin { // for login mutation input
    email: string,
    password: string
}