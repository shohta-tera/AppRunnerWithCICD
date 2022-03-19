#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { ContainerRegistryStack } from '../lib/containerRegistry-stack';
import { ApplicationStack } from '../lib/application-stack';

const app = new cdk.App();
const systemEnv = process.env.APPLICATION_ENV ?? 'dev'
new ContainerRegistryStack(app, 'ContainerRestryStack')
const appName = `${systemEnv}-FrontendStack`
const infraName = `${systemEnv}-InfrastructureStack`
new InfrastructureStack(app, infraName);
new ApplicationStack(app, appName)