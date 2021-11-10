STAGING_PROFILE = tarentumstage
LOCATION = https://kf8jkpz4i4.execute-api.eu-west-1.amazonaws.com/staging

build:
	npm run build

deploy-staging: build
	AWS_PROFILE=$(STAGING_PROFILE) serverless deploy --stage staging --verbose

logs-staging:
	AWS_PROFILE=$(STAGING_PROFILE) serverless logs --stage staging -f main

invoke-staging:
	AWS_PROFILE=$(STAGING_PROFILE) cat data.json | gzip | curl -v -i --location '$(LOCATION)' --header 'Content-Encoding: gzip' --data-binary @-

invoke-local:
	cat data.json | gzip | curl -v -i --location 'http://localhost:3000/dev/hello' --header 'Content-Encoding: gzip' --data-binary @-