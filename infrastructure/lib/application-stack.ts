import * as apprunner from 'aws-cdk-lib/aws-apprunner'
import * as cdk from 'aws-cdk-lib'

export class ApplicationStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const systemEnv = process.env.APPLICATION_ENV ?? 'dev'
    const imageTag = process.env.IMAGE_TAG ?? '1.0.0'
    const serviceName = `${systemEnv}-test-frontend`

    const accountId = cdk.Stack.of(this).account
    // const region = cdk.Stack.of(this).region

    const envList = [
      { name: 'PORT', value: '3000' }
    ]
    const registryName = process.env.ECR_REGISTRY ?? ''
    const repositoryName = `${registryName}/west/test-frontend`

    new apprunner.CfnService(this, 'test-application', {
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: `arn:aws:iam::${accountId}:role/service-role/${systemEnv}-ApprunnerECRAccessRole`
        },
        autoDeploymentsEnabled: true,
        imageRepository: {
          imageIdentifier: `${repositoryName}:${imageTag}`,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '3000',
            runtimeEnvironmentVariables: envList
          }
        }
      },
      instanceConfiguration: {
        cpu: '1024',
        memory: '2048',
        instanceRoleArn: `arn:aws:iam::${{ accountId }}:role/${systemEnv}-AppRunnerRole`
      },
      serviceName: serviceName
    })
  }
}