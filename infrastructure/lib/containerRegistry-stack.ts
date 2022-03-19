import { CfnReplicationConfiguration, Repository } from 'aws-cdk-lib/aws-ecr'
import { ParameterTier, StringParameter } from 'aws-cdk-lib/aws-ssm';
import * as cdk from 'aws-cdk-lib'

export class ContainerRegistryStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const accountId = cdk.Stack.of(this).account

    const repository = new Repository(this, 'testRepository', {
      repositoryName: 'west/test-frontend',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      imageScanOnPush: true
    })
    const replicationRuleProperty: CfnReplicationConfiguration.ReplicationRuleProperty = {
      destinations: [
        {
          region: 'eu-west-1',
          registryId: accountId
        }
      ]
    }
    new CfnReplicationConfiguration(this, 'ReplicationPolicy', {
      replicationConfiguration: {
        rules: [replicationRuleProperty]
      }
    })
    new StringParameter(this, 'RepositoryParatmeter', {
      description: 'Repo name for frontend',
      parameterName: '/west/ECRRepositoryName',
      stringValue: repository.repositoryUri,
      tier: ParameterTier.STANDARD
    })
  }
}