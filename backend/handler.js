module.exports.hello = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Hello from local serverless!',
            },
            null,
            2
        ),
    };
};

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const { USERS_TABLE, JWT_SECRET } = process.env;

// Register User
module.exports.registerUser = async (event) => {
  const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Email and password are required' })
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
        TableName: USERS_TABLE,
        Item: {
            email,
            password: hashedPassword
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User registered successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error registering user', error })
        };
    }
    };

// Login User
module.exports.loginUser = async (event) => {
    const { email, password } = JSON.parse(event.body);

    const params = {
        TableName: USERS_TABLE,
        Key: {
            email
        }
    };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'User not found' })
        };
    }

    const validPassword = await bcrypt.compare(password, result.Item.password);

    if (!validPassword) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid password' })
        };
    }

    // Generate JWT
    const token = jwt.sign({ email: result.Item.email }, JWT_SECRET, {
        expiresIn: '1h'
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', token })
    };
  } catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error logging in', error })
    };
  }
};

// Authenticated Route
module.exports.authenticatedRoute = async (event) => {
    const token = event.headers.Authorization.split(' ')[1]; // Extract Bearer token

  try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Access granted', user: decoded })
        };
  } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized', error })
        };
  }
};