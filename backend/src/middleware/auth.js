const { getAuth } = require('firebase-admin/auth');

    const authenticate = async (request, reply) => {
      const { authorization } = request.headers;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        return;
      }

      const token = authorization.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        request.user = decodedToken;
      } catch (error) {
        console.error('Error verifying auth token:', error);
      }
    };

    module.exports = authenticate;