import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serviceB',
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
    }
  },
  functions: {
    greet: {
      handler: 'src/handler.greet',
      events: [
        {
          http: {
            path: 'greet',
            method: 'get',
          },
        },
      ],
    },
  },
  package: {
    individually: true,
    exclude: ['serviceA/**', 'models/**'],
    include: ['models/**'],
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
    'serverless-offline': {
      httpPort: 3004,
      lambdaPort: 3005,
      websocketPort: 3001,
    },     
  },
};

module.exports = serverlessConfiguration;
