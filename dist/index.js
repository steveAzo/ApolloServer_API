import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
//A schema is a collection of type definitions (hence "typeDefs")
//that together defines the "shape" of queries that are executed against 
//your data
const typeDefs = `#graphql
    #Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in the data source.
    type Book {
        title: String
        author: Author
      }
      
      type Author {
        name: String
      }

    # The "Query" type is special: it lists all the available queries that 
    # clients can execute, along with the return type for each. In this 
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        books: [Book]
    }
    type Mutation {
        addBook(title: String, author: AuthorInput): Book
    }
    input AuthorInput {
        name: String
    }

`;
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: "City of Glass",
        author: "Paul Auster",
    },
];
//Resolver defines how to fetch the types defined in your schema.
// The resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
    },
    Mutation: {
        addBook: (parent, args) => {
            const newBook = {
                title: args.title,
                author: args.author,
            };
            books.push(newBook);
            return newBook;
        }
    }
};
// The ApolloServer constructs requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
// 1. creates an Express app
// 2. installs your ApolloServer instance as middleware
// 3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 400 },
});
console.log(`Server ready at: ${url}`);
