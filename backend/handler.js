const userFunctions = require('./functions/user');
const helpinhoFunctions = require('./functions/helpinho');


module.exports.getUser = async (event) => {
    const userId = event.pathParameters.id;
        try {
            const user = await userFunctions.getUserById(userId);
        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
        } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

module.exports.users = async (event) => {
    // O ID do usuário vem do authorizer
    const userId = event.requestContext.authorizer.principalId;
  
    try {
        const users = await connection.execute('SELECT * FROM users');
        return {
            statusCode: 200,
            body: JSON.stringify(users),
      };
    } catch (error) {
      return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

module.exports.createHelpinho = async (event) => {
    const data = JSON.parse(event.body);
    try {
        const result = await helpinhoFunctions.createHelpinho(data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Helpinho registered successfully', helpinhoId: result.helpinhoId }),
        };
        } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};


// module.exports.createHelpinho = async (event) => {
    
//   };

// Função para registrar um usuário
module.exports.register = async (event) => {
    const data = JSON.parse(event.body);
    try {
        const result = await userFunctions.registerUser(data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User registered successfully', userId: result.userId }),
        };
        } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

const { generateToken } = require('./auth'); 

module.exports.login = async (event) => {
    const { email, password } = JSON.parse(event.body);
        if (!email || !password) {
            return {
            statusCode: 422,
            body: JSON.stringify({ message: 'E-mail e senha são obrigatórios' }),
        };
    }
    const user = { id: 1, email: email };
  
    const token = generateToken(user);
  
    return {
        statusCode: 200,
        body: JSON.stringify({ user,token }),
    };
  };

    // module.exports.protectedRoute = async (event) => {
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify({ message: 'Protected content' }),
    //     };
    // };
  
  // Função para autenticar um usuário
    // module.exports.login = async (event) => {
    //     const data = JSON.parse(event.body);
    //     try {
    //     const result = await userFunctions.loginUser(data);
    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify({ message: 'User logged in successfully', userId: result.userId }),
    //         };
    //         } catch (error) {
    //         return {
    //             statusCode: 401,
    //             body: JSON.stringify({ error: error.message }),
    //         };
    //     }
    // };
  
    
 
  