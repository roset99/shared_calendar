import { ApolloServer } from 'apollo-server'; 
import jwt from 'jsonwebtoken';

import { typeDefs } from './data/schema';
import { resolvers } from './data/resolvers';

// SECRET
const SECRET = "createaverystrongsec34!retthatalsoincludes2423412wdsa324e34e";

// || ========== Apollo Server ========== ||

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: async ({ req }) => {
        const unverifiedToken = req.headers.authorization || '';
        let token;
        try {
            token = jwt.verify(unverifiedToken, SECRET);
            console.log(`Request from Family ID: ${(<any>token).user.id}`);
            return { user: (<any>token).user, SECRET };
        } catch (error) {
            // console.log(`Error caught: ${error.message}`);
            return { user: null, SECRET };
        }
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})
