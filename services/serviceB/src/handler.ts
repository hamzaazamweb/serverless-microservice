import { sayHelloWorld } from '@shared/utils/common';
import { APIGatewayProxyHandler } from 'aws-lambda';
// import { Sequelize } from 'sequelize-typescript';
// import { User } from '../../models/User';

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'localhost',
//   username: 'your_postgres_username',
//   password: 'your_postgres_password',
//   database: 'testdb',
//   models: [User]
// });

export const greet: APIGatewayProxyHandler = async (event, context) => {
 // await sequelize.authenticate();
  //const users = await User.findAll();
  sayHelloWorld();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Greetings from Service B',
    //  users
    })
  };
};
