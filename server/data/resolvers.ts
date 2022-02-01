import { Families, People, Events } from './dbConnectors';

// resolver map
export const resolvers = { 
    Query: {
        getAllFamilies: async () => {
            return Families.find({})
                .populate({ path:'members', populate: { path: 'events' }})
                .populate({ path:'events', populate: { path: 'attendees' }});
        },
        getOneFamily: async (root: any, { email }: any) => {
            return Families.findOne({ email: email })
                .populate({ path:'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: {path: 'attendees'}})
                .catch((error) => { console.log("error! Get Request failed" + error.message) });
        },
        getFamilyById: async (root: any, { id }: any) => {
            return Families.findById(id)
                .populate({ path:'members', populate: { path: 'events' }})
                .populate({ path: 'events', populate: {path: 'attendees'}})
                .catch((error) => { console.log("error! Get Request failed" + error.message) });
        },
        getAllPeople: async () => {
            return People.find({})
                .populate('family').populate('events')
                .catch((error) => { console.log("error! Get Request failed" + error.message) });
        },
        getOnePerson: async (root: any, { id }: any) => {
            return People.findById(id)
                .populate('family').populate('events')
                .catch((error) => { console.log("error! Get Request failed" + error.message) });
        },
        getAllEvents: async () => {
            return Events.find({})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }})
                .catch((error) => { console.log("error! Get Request failed" + error.message) });
        },
        getOneEvent: async (root: any, { id }: any) => {
            return Events.findById(id)
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }})
                .catch((error) => { console.log("error! Get Request failed" + error.message) });  
        },
        getEventsByFamily: async (root: any, { family }: any) => {
            return Events.find({family: family.id})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }})
                .catch((error) => { console.log("error! Get Request failed" + error.message) });
        },
    },
    Mutation: {
        createPerson: async (root: any, { input }: any) => {
            const newPerson = new People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: input.family.id
            });
            
            newPerson.id = newPerson._id;

            newPerson.save()
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

            const family = await Families.findById(newPerson.family)
            if (!family) {
                throw new Error
            }
            family.members.push(newPerson.id)

            Families.updateOne({ _id: family.id }, family, { new: true })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

            const returnPerson = {
                id: newPerson.id,
                name: newPerson.name,
                birthday: newPerson.birthday,
                events: newPerson.events,
                colour: newPerson.colour,
                family: family
            }
            
            return returnPerson
        },
        updatePerson: async (root: any, { input }: any) => {
            await People.findOneAndUpdate({ _id: input.id }, input, { new: true })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) })

            return await People.findById(input.id)
                .populate('family')
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) }); 
        },
        deletePerson: async (root: any, { id }: any) => {
            const person = await People.findById(id)
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
            if (!person) {
                return ('Person not found');
            }

            await People.deleteOne({ _id: id })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

            // const family = await Families.findById(person.family)
            //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
            // if (!family) {
            //     return ('Family not found')
            // }
            // family.members.pull(id);
            // family.save()
            //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

            await Families.updateOne({ _id: person.family }, { "$pull": { "members": { _id: person.id }}});

            return ('Successfully deleted person');
        },
        createEvent: async (root: any, { input }: any) => {
            const newEvent = new Events({
                title: input.title,
                family: input.family.id,
                attendees: [],
                date: input.date,
                startTime: input.startTime,
                endTime: input.endTime
            });

            newEvent.id = newEvent._id;           

            const returnEvent = {
                id: newEvent.id,
                title: input.title,
                family: input.family.id,
                attendees: new Array(),
                date: input.date,
                startTime: input.startTime,
                endTime: input.endTime
            }

            for (let i = 0; i < input.attendees.length; i++) {
                const person = await People.findById(input.attendees[i].id)
                    .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
                if (!person) {
                    throw new Error("Error")
                }
                person.events.push(newEvent.id);

                await People.updateOne({ _id: person.id }, person, { new: true })
                    .catch((error) => { console.log("error! Mutation Request failed" + error.message) })

                newEvent.attendees.push(person.id);
                returnEvent.attendees.push(person);   
            }

            newEvent.save()
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
            
            // const family = await Families.findById(newEvent.family)
            // family.events.push(newEvent)

            // Families.updateOne({ _id: family.id }, family, { new: true }).catch((error) => {console.log("error! Mutation Request failed" + error.message)})

            await Families.updateOne({ _id: newEvent.family }, { "$push": { "members": { _id: newEvent.id }}});

            return returnEvent;
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
            const event = await Events.findById(id)
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });            
            if (!event) {
                throw new Error("Error")
            }

            await Events.deleteOne({ _id: id })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

            // const family = await Families.findById(event.family)
            //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });;
            // family.events.pull(id);
            // family.save();

            await Families.updateOne({ _id: event.family }, { "$pull": { "events": { _id: event.id }}});

            // remove from person.events
            for (let i = 0; i < event.attendees.length; i++) {
                // const person = await People.findById(event.attendees[i], () => {}) 
                //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

                // person.events.pull(event.id);

                // await People.updateOne({ _id: person.id }, person, { new: true }, () => {})
                //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });

                await People.updateOne({ _id: event.attendees[i] }, { "$pull": { "attendees": { _id: event.id }}});
            } 
            
            return ('Successfully deleted event');
        },
        createFamily: async (root: any, { input }: any) => {
            const newFamily = new Families({
                familyName: input.familyName,
                email: input.email,
                password: input.password,
                members: input.members,
                events: input.events
            });

            newFamily.id = newFamily._id;

            newFamily.save((err) => {});
            return newFamily
        },
        updateFamily: async (root: any, { input }: any) => {
            return Families.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err) => {}) 
        },
        deleteFamily: async (root: any, { id }: any) => {
            const family = await Families.findById(id);
            if (!family) {
                throw new Error
            }

            for (let i=0; i < family.members.length; i++){
                const member = await People.findById(family.members[i]);
                if (!member) {
                    throw new Error
                }
                await People.deleteOne({ _id: member.id })
            }
        
            for (let i=0; i < family.events.length; i++){
                const event = await Events.findById(family.events[i]);
                if (!event) {
                    throw new Error
                }
                await Events.deleteOne({ _id: event.id })
            }
            
            await Families.deleteOne({ _id: id });
            return ('Succesfully deleted family')
        }
    },
};