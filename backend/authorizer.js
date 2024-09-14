const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    const token = event.authorizationToken && event.authorizationToken.replace('Bearer ', '');

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized' }),
        };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
        principalId: decoded.id,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: event.methodArn,
            },
            ],
        },
        };
    } catch (error) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden' }),
        };
    }
};