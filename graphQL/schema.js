const graphql = require('graphql'),
      {GraphQLObjectType, GraphQLSchema, GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLID, GraphQLList} = graphql;

let firebase = require('../firebase.config'),
    firestore = firebase.firestore(),
    booksReference = firestore.collection('books'),
    authorsReference = firestore.collection('authors');

const getAuthorById = (id) => authorsReference.doc(id).get().then(doc => doc.data());

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve: (parent, args) => {
                return getAuthorById(parent.authorId)
            }}
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve: (parent) => {
                return booksReference.get().then(query => query.docs.map(doc => doc.data()).filter(doc => doc.authorId === parent.id));
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        book: {
            type: BookType,
            args: {id : {type: GraphQLID}},
            resolve: (parent, args) => {
                return booksReference.doc(args.id).get().then(doc => doc.data());
            }
        },
        author: {
            type: AuthorType,
            args: {id : {type: GraphQLID}},
            resolve: (parent, args) => {
                return getAuthorById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: () => {
                // booksReference.get().then(query => query.docs.forEach(doc => console.log(doc.data())));
               // booksReference.doc('2x6b7lSOKCHADaP2MMD8').get().then(doc => console.log(doc.data()));
                return booksReference.get().then(query => query.docs.map(doc => doc.data()));
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: () => {
                return authorsReference.get().then(query => query.docs.map(doc => doc.data()));
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID),},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve : (parent, args) => {
                return booksReference.doc(args.id).set({
                    id : args.id,
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                }).then(() => authorsReference.doc(args.authorId).update({
                    bookIds : firebase.firestore.FieldValue.arrayUnion(args.id)
                }))
                  .then(() => booksReference.doc(args.id).get())
                  .then(doc => doc.data())
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID),},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve : (parent, args) => {
                return authorsReference.doc(args.id).set({
                    id : args.id,
                    name: args.name,
                    age: args.age,
                    bookIds: []
                }).then(() => authorsReference.doc(args.id).get())
                  .then(doc => doc.data())
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})