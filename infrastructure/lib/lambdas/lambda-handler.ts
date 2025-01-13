import * as clientTranslate from "@aws-sdk/client-translate";
import * as lambda from "aws-lambda"
import { error, timeStamp } from "console";

const translateClient = new clientTranslate.TranslateClient({})


export const index: lambda.APIGatewayProxyHandler = async (
    event:lambda.APIGatewayProxyEvent)=> {

    try{
    
    if(!event.body){
        throw new Error('the body is undefined')
    }

    const body = JSON.parse(event.body)
    const {text, sourceLang, targetLang} = body;

    const now = new Date(Date.now()).toString();
    
    console.log(now)
    
    const command = new clientTranslate.TranslateTextCommand({
        SourceLanguageCode:sourceLang,
        TargetLanguageCode: targetLang, 
        Text: text
        
    })

    const response = await translateClient.send(command)
    console.log(response)

    // you could just return body:response.TranslatedText, but I want to add the time
    // so I create the rtnData object below which has timestamp and the 

    const rtnData = {
        timeStamp: now, 
        text: response.TranslatedText

    }

    return{ 
        
        statusCode:200,
        headers:{
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":" true",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"


        },
        body: JSON.stringify(rtnData)
        // body:response.TranslatedText
    }

}catch(e:any){console.error(e);

    return{
        statusCode:500,
        headers:{
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":" true",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"


        },
        body: e.toString()
    }
}

}

  