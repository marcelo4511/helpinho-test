const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  
  region: "localhost",
  endpoint: 'http://localhost:8000',
});

module.exports.listUsers = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error }),
    };
  }
};
