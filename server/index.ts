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
        const token = req.headers.authorization || '';
        let user;
        try {
            user = jwt.verify(token, SECRET);
            console.log(`${(<any>user).user.id} user`);
        } catch (error) {
            console.log(`${error.message} caught`);
        }

        return { user, SECRET };
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})
