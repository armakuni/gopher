# gopher
Gopher bot for slack (back-end Google Cloud Function)

## Configuration
Use environment variable `API_TOKEN` to specify the bearer token for the Slack API

## Available endpoints

`getUser`
Calls the Slack API and returns a random user in the format needed for posting as an "in channel" message in Slack:
```
{
  "response_type": "in_channel",
  "text": `${chosen.real_name}: <@${chosen.name}>`
}
```
