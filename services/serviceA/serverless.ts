import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serviceA',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      restApiId: {
        'Fn::ImportValue': 'SharedGW-restApiId',
      },
      restApiRootResourceId: {
        'Fn::ImportValue': 'SharedGW-rootResourceId',
      },
    },
  },
  functions: {
    hello: {
      handler: 'src/handler.hello',
      events: [
        {
          http: {
            path: 'hello',
            method: 'get',
            authorizer: {
              type: 'COGNITO_USER_POOLS',
              authorizerId: {
                'Fn::ImportValue': 'CognitoAuthorizerId',
              },
            },
          },
        },
      ],
    },
  },
  package: {
    individually: true,
    // exclude: ['../serviceB/**', '../models/**'],  // Exclude other service files
    // include: ['../models/**'],  
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
};

module.exports = serverlessConfiguration;
