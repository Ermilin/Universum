const typeDefs = `
  type Query {
    groups: [User]
    universum(name: String): [Dept]
    group(name: String): Group
    dept(name: String, group: String, system: String): Dept
  }
  type User {
    id: ID!
    name: String!
    status: String!
  }
  type Dept {
    name: String
    groups(name: String): [Group!]
  }
  type Group {
    name: String
    systems: [System]
  }
  type System {
    name: String
    entities: [Entity]
  }
  type Status {
    code: String
    comment: String
  }
  type Entity {
    id: ID
    name: String
    label: String
    operatingSystem: String
    IP: String
    status: Status
    dependencies: [Dependencies]
  }
  type Dependencies {
    name: String
  }
`

exports.typeDefs = typeDefs