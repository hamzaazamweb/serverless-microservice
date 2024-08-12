import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'shared-gateway',
  frameworkVersion: '3',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
  },
  resources: {
    Resources: {
    ApiGatewayRestApi: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
              Name: 'SharedApiGateway',
            },
    },
      SharedGW: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
          Name: 'SharedGW',
        },
      },
      
      CognitoUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
            UserPoolName: `${process.env.SLS_COGNITO_USER_POOL_NAME}`,
            Schema: [
              {
                Name: 'email',
                Required: true,
                Mutable: false,
                AttributeDataType: 'String',
              },
              {
                Mutable: true,
                Name: 'name',
                Required: true,
                AttributeDataType: 'String',
              },
              {
                Mutable: true,
                Required: false,
                Name: 'phone_number',
                AttributeDataType: 'String',
              },
              {
                Mutable: true,
                Name: 'full_name',
                AttributeDataType: 'String',
              },
              {
                Mutable: true,
                Name: 'organization',
                AttributeDataType: 'String',
              },
              {
                Mutable: true,
                Name: 'picture',
                AttributeDataType: 'String',
              },
            ],
            Policies: {
              PasswordPolicy: {
                MinimumLength: 8,
                RequireLowercase: true,
                RequireNumbers: true,
                RequireUppercase: true,
                RequireSymbols: false,
              },
            },
            AutoVerifiedAttributes: ['email'],
            AccountRecoverySetting: {
              RecoveryMechanisms: [
                {
                  Name: 'verified_email',
                  Priority: 1,
                },
              ],
            },
            AdminCreateUserConfig: {
              AllowAdminCreateUserOnly: 'True',
            },
            LambdaConfig: {
              PostAuthentication:
                'arn:aws:lambda:${aws:region}:${aws:accountId}:function:${self:service}-${self:provider.stage}-SetUserActive',
              CustomEmailSender: {
                LambdaArn:
                  'arn:aws:lambda:${aws:region}:${aws:accountId}:function:${self:service}-${self:provider.stage}-CognitoLambdaTrigger',
                LambdaVersion: 'V1_0',
              },
              KMSKeyID: { 'Fn::GetAtt': ['KMSEncryptionKey', 'Arn'] },
            },
            EmailConfiguration: {
              EmailSendingAccount: 'DEVELOPER',
              SourceArn: 'arn:aws:ses:${aws:region}:${aws:accountId}:identity/sigmasight.net',
              From: 'SigmaSight <no-reply@sigmasight.net>',
            },
          },
        },
        UserPoolClient: {
          Type: 'AWS::Cognito::UserPoolClient',
          Properties: {
            ClientName: 'sigmasight-user-pool-client',
            GenerateSecret: false,
            UserPoolId: { Ref: 'CognitoUserPool' },
            PreventUserExistenceErrors:'ENABLED'
          },
      },
      CognitoUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'UserPoolClient',
          UserPoolId: {
            Ref: 'CognitoUserPool',
          },
          GenerateSecret: false,
        },
      },
      CognitoAuthorizer: {
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
          Name: 'CognitoAuthorizer',
          Type: 'COGNITO_USER_POOLS',
          IdentitySource: 'method.request.header.Authorization',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',  // Assuming you have defined an API Gateway
          },
          ProviderARNs: [
            {
              'Fn::GetAtt': ['CognitoUserPool', 'Arn'],
            },
          ],
        },
    },
    CognitoInvokePermission: {
        Type: 'AWS::Lambda::Permission',
        Properties: {
          FunctionName: '${self:service}-${self:provider.stage}-CognitoLambdaTrigger',
          Action: 'lambda:InvokeFunction',
          Principal: 'cognito-idp.amazonaws.com',
        },
        DependsOn: ['CognitoLambdaTriggerLambdaFunction'],
      },
    },
    Outputs: {
        CognitoUserPoolId: {
            Value: {
              Ref: 'CognitoUserPool',
            },
            Export: {
              Name: 'CognitoUserPoolId',
            },
          },
          CognitoUserPoolArn: {
            Value: {
              'Fn::GetAtt': ['CognitoUserPool', 'Arn'],
            },
            Export: {
              Name: 'CognitoUserPoolArn',
            },
          },
          CognitoAuthorizerId: {
            Value: {
              Ref: 'CognitoAuthorizer',
            },
            Export: {
              Name: 'CognitoAuthorizerId',
            },
          },
      apiGatewayRestApiId: {
        //value of the rest api id
        Value: {
          Ref: 'SharedGW',
        },
        // this name would be used to import value in other stacks
        Export: {
          Name: 'SharedGW-restApiId',
        },
      },
      apiGatewayRestApiRootResourceId: {
        Value: {
          'Fn::GetAtt': ['SharedGW', 'RootResourceId'],
        },
        Export: {
          Name: 'SharedGW-rootResourceId',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
