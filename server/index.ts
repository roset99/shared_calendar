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
        // const unverifiedToken = req.headers.authorization?.split(' ')[1] || '';
        const unverifiedToken = req.headers.authorization || ''; // this line doesn't include Bearer
        let token;
        try {
            token = jwt.verify(unverifiedToken, SECRET);
            console.log(`Request from Family ID: ${(<any>token).user.id}`);
        } catch (error) {
            // console.log(`Error caught: ${error.message}`);
            token = null;
        }

        return { user: (<any>token)?.user, SECRET };
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})
