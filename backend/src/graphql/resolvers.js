 const resolvers = {
      Query: {
        hello: () => 'Hello, world!',
        protectedData: (parent, args, context) => {
          if (!context.user) {
            throw new Error('You must be logged in to see this!');
          }
          return `Welcome, ${context.user.name}! Here is your protected data.`;
        },
      },
    };

module.exports = resolvers;
