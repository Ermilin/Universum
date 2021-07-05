const sql = require("mssql");
const { nestedTree } = require("../models/nestedTree");
const { findNestedObj } = require("../utils/findNestedObj");

const resolvers = {
  Query: {
    universum: async (parent, args, context, info) => {
      try {
        const data = await nestedTree();
        return data;
      } catch (error) {
        throw error;
      }
    },
    dept: async (parent, args, context, info) => {
      console.log(args);
      console.log(parent);
      try {
        const data = await nestedTree();

        //if query contains a group argument
        if (args.system) {
          let result = findNestedObj(data, "name", args.name);

          result.groups = findNestedObj(data, "name", args.name).groups.filter(
            (x) => x.name == args.group
          );
          result.groups[0].systems = result.groups[0].systems.filter(
            (x) => x.name == args.system
          );
          console.log(result.groups[0]);
          return result;
        }

        if (args.group) {
          // filter out the queried group //dept(name: "HR", group: "Marketing")
          let result = findNestedObj(data, "name", args.name);
          result.groups = findNestedObj(data, "name", args.name).groups.filter(
            (x) => x.name == args.group
          );
          return result;
        } else {
          //Return the queried dept
          return findNestedObj(data, "name", args.name);
        }
      } catch (error) {
        throw error;
      }
    },
    group: async (parent, args, context, info) => {
      try {
        const data = await nestedTree();
        console.log(findNestedObj(data, "name", args.name));
        return findNestedObj(data, "name", args.name);
      } catch (error) {
        throw error;
      }
    },
  },
};

exports.resolvers = resolvers