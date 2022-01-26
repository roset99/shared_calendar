import { Families, People, Events } from './dbConnectors';

// resolver map
export const resolvers = { 
    Query: {
        getAllFamilies: () => {
            return Families.find({}).populate({ path:'members', populate: { path: 'events' }});
        },
        getOneFamily: (root, { email }) => {
            return Families.findOne({ email: email }, (err) => {
                if (err) reject(err) 
            })
                .populate({ path:'members', populate: { path: 'events' }});
        },
        getFamilyById: (root, { id }) => {
            return Families.findById(id, (err) => {
                if (err) reject(err)
            })
                .populate({ path:'members', populate: { path: 'events' }});
        },
        getAllPeople: () => {
            return People.find({})
                .populate('family').populate('events');
        },
        getOnePerson: async (root, { id }) => {
            return People.findById(id, (err) => { if (err) reject(err) })
                .populate('family').populate('events');
        },
        getAllEvents: () => {
            return Events.find({})
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});
        },
        getOneEvent: (root, { id }) => {
            return Events.findById(id, (err) => { if (err) reject(err) })
                .populate({ path: 'attendees', populate: { path: 'family' }})
                .populate({ path: 'family', populate: { path: 'members' }});  
        }
    },
    Mutation: {
        createPerson: async (root, { input }) => {
            const newPerson = new People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: input.family.id
            });
            
            newPerson.id = newPerson._id;

            newPerson.save((err) => { if (err) reject(err) });

            const family = await Families.findById(newPerson.family)
            family.members.push(newPerson)

            Families.updateOne({ _id: family.id }, family, { new: true }, (err, family) => {
                if (err) reject(err)
            })

            newPerson.family = family
            return newPerson
        },
        updatePerson: async (root, { input }) => {
            await People.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, person) => {
                if (err) reject(err)
            })

            return await People.findById(input.id, (err) => { if (err) reject(err) })
                .populate('family'); 
        },
        deletePerson: async (root, { id }) => {
            const person = await People.findById(id, (err) => { 
                if (err) reject(err) 
            })

            await People.deleteOne({ _id: id }, (err) => {
                if (err) reject(err)
            });

            const family = await Families.findById(person.family, (err) => {
                if (err) reject(err)
            });
            family.members.pull(id);
            family.save((err) => { if (err) reject(err) });

            return ('Successfully deleted person')
        },
        createEvent: async (root, { input }) => {
            const newEvent = new Events({
                family: input.family,
                owner: input.owner,
                attendees: [],
                date: input.date,
                time: input.time
            });

            const returnEvent = {
                family: input.family,
                owner: input.owner,
                attendees: [],
                date: input.date,
                time: input.time
            }

            newEvent.id = newEvent._id;           

            for (let i = 0; i < input.attendees.length; i++) {
                const person = await People.findById(input.attendees[i].id);
                person.events.push(newEvent.id);

                await People.updateOne({ _id: person.id }, person, { new: true }, (err, person) => {
                    if (err) reject(err)
                })

                newEvent.attendees.push(person.id);
                returnEvent.attendees.push(person);   
            }

            newEvent.save((err) => { if (err) reject(err) });

            return returnEvent;
        },
        updateEvent: (root, { input }) => {
            return Events.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, event) => {
                if (err) reject(err)
            })
        },
        deleteEvent: (root, { id }) => {
            Events.remove({ _id: id }, (err) => {
                if (err) reject(err)
                else return('Successfully deleted event')
            })
        },
        createFamily: (root, { input }) => {
            const newFamily = new Families({
                email: input.email,
                password: input.password,
                members: input.members
            });

            newFamily.id = newFamily._id;

            return newFamily.save((err) => {
                if (err) reject(err)
            })
        },
        updateFamily: (root, { input }) => {
            return Families.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err, family) => {
                if (err) reject(err)  
            })
        },
        deleteFamily: (root, { id }) => {
            Families.remove({ _id: id }, (err) => {
                if (err) reject(err)
                else return('Successfully deleted family')
            })
        }
    },
};