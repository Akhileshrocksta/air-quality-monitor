# Air Quality Monitor - Cloud Functions

It is the back-end of the project infrastructure.

Used:
- Google Firebase: REST API and database.
- Secret key authentication for devices.
- Username and password pair to authenticating the users

Written in Typescript.

## Development

Download remote configuration.
On Linux/MacOS:
```
firebase functions:config:get > .runtimeconfig.json
```
On Windows:
```
firebase functions:config:get | ac .runtimeconfig.json
```

And emulate the Firebase functions:
```
firebase emulators:start
```

## Deploy

### Create index

In the database you must create the index for the _reading_ collection and indexed fields:
- deviceId ascending 
- type ascending 
- inserted descending

### Deploy functions

```bash
firebase deploy --only functions
```

## Configuration 

### Users

The configuration `airqualitymonitor.users` collects the granted users to access to the application.

```json
[
    {
        "username": "...",
        "password": "..."
    }
]
```

To set the variable:

```bash
firebase functions:config:set airqualitymonitor.users="__the_escaped_json__"
```

### Devices Authorizations

The configuration `airqualitymonitor.devicesauthorizations` collects the secret keys and what air quality data is possible to read and/or to write from a device.

```json
[
    {
        "secretKey": "...",
        "authorizations": [
            {
                "deviceId": "...",
                "scopes": [ "...", "..." ]
            }
        ]
    }
]
```

- The field `secretKey`
- The field `authorizations`
- The field `deviceId`
- The field `scopes`

To set the variable:

```bash
firebase functions:config:set airqualitymonitor.devicesauthorizations="__the_escaped_json__"
```

### Users Authorizations

The configuration `airqualitymonitor.usersauthorizations` collects the username and what air quality data is possible to read and/or to write from a device.

```json
[
    {
        "username": "...",
        "authorizations": [
            {
                "deviceId": "...",
                "scopes": [ "...", "..." ]
            }
        ]
    }
]
```

- The field `username`
- The field `authorizations`
- The field `deviceId`
- The field `scopes`

To set the variable:

```bash
firebase functions:config:set airqualitymonitor.usersauthorizations="__the_escaped_json__"
```