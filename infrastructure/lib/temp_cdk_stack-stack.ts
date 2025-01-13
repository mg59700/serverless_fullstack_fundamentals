import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs'
import {aws_apigateway} from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam';



export class TempCdkStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// a policy that gets attatched to lambdas
// allowing it to access the translate resource
const translateResourcePolicy = new iam.PolicyStatement({
  actions:["translate:TranslateText"], 
  resources:["*"]

})

const timeOfDay = new lambdaNodeJs.NodejsFunction(this, 'timeOfDay', {
      entry:'lib/lambdas/lambda-handler.ts',
      handler: 'index', 
      initialPolicy: [translateResourcePolicy]

    });

const RestApi = new aws_apigateway.RestApi(this, 'RestAPI')
   
    RestApi.root.addMethod("POST", new aws_apigateway.LambdaIntegration(timeOfDay))
}
}