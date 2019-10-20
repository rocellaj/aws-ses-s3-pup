# SES-LAMBDA-PUPPEETER

End to end testing for casl service using serverless, lambda, puppeteer, s3 and lambda 

1. Receive incoming emails from SES 
2. Store in s3 
3. Lambda will pick up the email and parse 
4. Puppeteer will execute unsubscribe flow 
5. Verify unsubscribe from 3rd party services (intercom, salesforce)

## Getting started 

1. Run `npm i`
2. Update `./src/services/s3` with aws credentials
3. Update `serverless.yml` with your aws profile 
4. To deploy: `sls deploy`
5. To deploy offline: `sls offline`

## SES & S3 Configuration

## S3 
1. Setup folder structure 
    `<root_folder>/unread` - incoming email
    `<root_folder>/read` - move to s3 once email has been tested
2. Add folder policy    

        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "AllowSESPuts",
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "ses.amazonaws.com"
                    },
                    "Action": "s3:PutObject",
                    "Resource": "arn:aws:s3:::<folder_name>/*"
                }
            ]
        }    
        
## SES 
1. Setup domain with workmail (quickstart)
2. Add domain in ses and add route 53 mx record 
3. Set rule in email receiving
