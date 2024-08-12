import { APIGatewayProxyHandler } from 'aws-lambda';
//import { Sequelize } from 'sequelize-typescript';
// import { User } from '../../models/User';
//import { User } from '@shared/models/User';

// const sequelize = new Sequelize({
//   dialect: 'mysql',
//   host: 'localhost',
//   username: 'root',
//   password: 'password',
//   database: 'testdb',
//   models: [User]
// });

export const hello: APIGatewayProxyHandler = async (event, context) => {
   //await sequelize.authenticate();
  //const users = await User.findAll();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Service A',
     // users
    })
  };
};