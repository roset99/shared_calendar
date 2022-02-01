"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const dbConnectors_1 = require("./dbConnectors");
// resolver map
exports.resolvers = {
    Query: {
        getAllFamilies: () => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Families.find({})
                .populate({ path: 'members', populate: { path: 'events' } })
                .populate({ path: 'events', populate: { path: 'attendees' } });
        }),
        getOneFamily: (root, { email }) => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Families.findOne({ email: email })
                .populate({ path: 'members', populate: { path: 'events' } })
                .populate({ path: 'events', populate: { path: 'attendees' } })
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
        getFamilyById: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Families.findById(id)
                .populate({ path: 'members', populate: { path: 'events' } })
                .populate({ path: 'events', populate: { path: 'attendees' } })
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
        getAllPeople: () => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.People.find({})
                .populate('family').populate('events')
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
        getOnePerson: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.People.findById(id)
                .populate('family').populate('events')
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
        getAllEvents: () => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Events.find({})
                .populate({ path: 'attendees', populate: { path: 'family' } })
                .populate({ path: 'family', populate: { path: 'members' } })
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
        getOneEvent: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Events.findById(id)
                .populate({ path: 'attendees', populate: { path: 'family' } })
                .populate({ path: 'family', populate: { path: 'members' } })
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
        getEventsByFamily: (root, { family }) => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Events.find({ family: family.id })
                .populate({ path: 'attendees', populate: { path: 'family' } })
                .populate({ path: 'family', populate: { path: 'members' } })
                .catch((error) => { console.log("error! Get Request failed" + error.message); });
        }),
    },
    Mutation: {
        createPerson: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const newPerson = new dbConnectors_1.People({
                name: input.name,
                birthday: input.birthday,
                events: input.events,
                colour: input.colour,
                family: input.family.id
            });
            newPerson.id = newPerson._id;
            newPerson.save()
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            const family = yield dbConnectors_1.Families.findById(newPerson.family);
            if (!family) {
                throw new Error;
            }
            family.members.push(newPerson.id);
            dbConnectors_1.Families.updateOne({ _id: family.id }, family, { new: true })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            const returnPerson = {
                id: newPerson.id,
                name: newPerson.name,
                birthday: newPerson.birthday,
                events: newPerson.events,
                colour: newPerson.colour,
                family: family
            };
            return returnPerson;
        }),
        updatePerson: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            yield dbConnectors_1.People.findOneAndUpdate({ _id: input.id }, input, { new: true })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            return yield dbConnectors_1.People.findById(input.id)
                .populate('family')
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
        }),
        deletePerson: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const person = yield dbConnectors_1.People.findById(id)
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            if (!person) {
                return ('Person not found');
            }
            yield dbConnectors_1.People.deleteOne({ _id: id })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            // const family = await Families.findById(person.family)
            //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
            // if (!family) {
            //     return ('Family not found')
            // }
            // family.members.pull(id);
            // family.save()
            //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
            yield dbConnectors_1.Families.updateOne({ _id: person.family }, { "$pull": { "members": { _id: person.id } } });
            return ('Successfully deleted person');
        }),
        createEvent: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const newEvent = new dbConnectors_1.Events({
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
            };
            for (let i = 0; i < input.attendees.length; i++) {
                const person = yield dbConnectors_1.People.findById(input.attendees[i].id)
                    .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
                if (!person) {
                    throw new Error("Error");
                }
                person.events.push(newEvent.id);
                yield dbConnectors_1.People.updateOne({ _id: person.id }, person, { new: true })
                    .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
                newEvent.attendees.push(person.id);
                returnEvent.attendees.push(person);
            }
            newEvent.save()
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            // const family = await Families.findById(newEvent.family)
            // family.events.push(newEvent)
            // Families.updateOne({ _id: family.id }, family, { new: true }).catch((error) => {console.log("error! Mutation Request failed" + error.message)})
            yield dbConnectors_1.Families.updateOne({ _id: newEvent.family }, { "$push": { "members": { _id: newEvent.id } } });
            return returnEvent;
        }),
        updateEvent: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            // const oldEvent = await Events.findOneAndUpdate({ _id: input.id }, input, { new: false }, () => {});
            // const newEvent = await Events.findById(input.id, (err) => {});
            // const oldEvent = await Events.findById(input.id);
            yield dbConnectors_1.Events.findOneAndUpdate({ _id: input.id }, input);
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
            return yield dbConnectors_1.Events.findById(input.id, () => { })
                .populate({ path: 'attendees', populate: { path: 'family' } })
                .populate({ path: 'family', populate: { path: 'members' } });
        }),
        deleteEvent: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const event = yield dbConnectors_1.Events.findById(id)
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            if (!event) {
                throw new Error("Error");
            }
            yield dbConnectors_1.Events.deleteOne({ _id: id })
                .catch((error) => { console.log("error! Mutation Request failed" + error.message); });
            // const family = await Families.findById(event.family)
            //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });;
            // family.events.pull(id);
            // family.save();
            yield dbConnectors_1.Families.updateOne({ _id: event.family }, { "$pull": { "events": { _id: event.id } } });
            // remove from person.events
            for (let i = 0; i < event.attendees.length; i++) {
                // const person = await People.findById(event.attendees[i], () => {}) 
                //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
                // person.events.pull(event.id);
                // await People.updateOne({ _id: person.id }, person, { new: true }, () => {})
                //     .catch((error) => { console.log("error! Mutation Request failed" + error.message) });
                yield dbConnectors_1.People.updateOne({ _id: event.attendees[i] }, { "$pull": { "attendees": { _id: event.id } } });
            }
            return ('Successfully deleted event');
        }),
        createFamily: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            const newFamily = new dbConnectors_1.Families({
                familyName: input.familyName,
                email: input.email,
                password: input.password,
                members: input.members,
                events: input.events
            });
            newFamily.id = newFamily._id;
            newFamily.save((err) => { });
            return newFamily;
        }),
        updateFamily: (root, { input }) => __awaiter(void 0, void 0, void 0, function* () {
            return dbConnectors_1.Families.findOneAndUpdate({ _id: input.id }, input, { new: true }, (err) => { });
        }),
        deleteFamily: (root, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const family = yield dbConnectors_1.Families.findById(id);
            if (!family) {
                throw new Error;
            }
            for (let i = 0; i < family.members.length; i++) {
                const member = yield dbConnectors_1.People.findById(family.members[i]);
                if (!member) {
                    throw new Error;
                }
                yield dbConnectors_1.People.deleteOne({ _id: member.id });
            }
            for (let i = 0; i < family.events.length; i++) {
                const event = yield dbConnectors_1.Events.findById(family.events[i]);
                if (!event) {
                    throw new Error;
                }
                yield dbConnectors_1.Events.deleteOne({ _id: event.id });
            }
            yield dbConnectors_1.Families.deleteOne({ _id: id });
            return ('Succesfully deleted family');
        })
    },
};
//# sourceMappingURL=resolvers.js.map