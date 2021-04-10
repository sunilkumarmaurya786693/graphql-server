// GraphQL typeDef
const typeDefs = `
    type User {
        id: ID
        user_name: String
        email: String
        password: String
        groups: [Group]
        messages: [Message]
        user_type: String
    }
    
    type Message {
        id: ID
        sender: User
        group: Group
        content: String
        createdAt: String
    }

    type Group {
        id: ID
        group_name: String
        members: [User]
        messages: [Message]
        createdAt: String
    }


"""
this is query
"""
    type Query {
        get_users: [User]
        get_messages: [Message]
        get_groups: [Group]
        login(email:String!, password: String!): String
    }


"""
these are mutations
"""
    type Mutation {
        register(user_name: String!, email: String!, password: String!, user_type: String):User
        add_message(content: String!, group_id: String!, timeStamp: String): Boolean
        add_group_member (group_id: String!): Boolean
        create_group (group_name: String!): Boolean
    }

"""
these are subscriptions
"""

type Subscription {
    get_new_message: Message
}
`;

module.exports = typeDefs;
