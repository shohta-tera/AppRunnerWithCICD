import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accountId = cdk.Stack.of(this).account
    const region = cdk.Stack.of(this).region
    const systemEnv = process.env.APPLICATION_ENV ?? 'dev'

    new iam.Role(this, 'ServiceRoleForAppRunner', {
      roleName: `${systemEnv}-AppRunnerECRAccessRole`,
      assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('build.apprunner.amazonaws.com')),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppRunnerServicePolicyForECRAccess')
      ],
      path: '/service-role/'
    })

    new iam.Role(this, 'ServiceRoleForApplication', {
      roleName: `${systemEnv}-AppRunnerRole`,
      assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('tasks.apprunner.amazonaws.com')),
      inlinePolicies: {
        inlinePolicies: iam.PolicyDocument.fromJson({
          Version: '2012-10-17',
          Statement: [{
            Effect: 'Allow',
            Action: ['ssm:GetParameter*'],
            Resource: `arn:aws:ssm${region}:${accountId}:parameter/*`
          },
          {
            Effect: 'Allow',
            Action: ['kms:Decrypt'],
            Resouce: `arn:aws:kms:${region}:${accountId}:key/*`
          }
        ]
        })
      }
    })
  }
}

