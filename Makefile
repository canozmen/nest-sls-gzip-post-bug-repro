build:
	npm run build

deploy-staging: build
	AWS_PROFILE=tarentumstage serverless deploy --stage staging --verbose

logs-staging:
	AWS_PROFILE=tarentumstage serverless logs --stage staging -f main