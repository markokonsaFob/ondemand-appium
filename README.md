# On-Demand Appium Service
On-Demand appium service is simple Node JS proxy application for Appium automation. This repository starts Appium services automaticaly for connected real devices and simulators.

## Starting Service
In order to start Appium service user have to send following command:
```
node index.js
```

This command will start On-Demand Appium service on 4723 port as usual Appium.

## High level request flows
More information about Appium requests can be found from here: ![API Documentation] (http://appium.io/docs/en/about-appium/api/)

### POST wd/hub/session
POST request in made for creating new Appium session.

1. User sends correct Appium POST session request to On-Demand Service
2. On-Demand service finds available port in the range of 4000-8000
3. Service starts Appium service on given port
4. Service remembers the given port for Session-ID
5. Service returns valid Appium request to end-user.

### DELETE wd/hub/session
DELETE request is made for deleting Appium service.

1. User sends correct Appium DELETE request to On-Demand Service
2. On-Demand service finds port for given Session-ID
3. Service proxies given request to right port
4. Appium closes the session
5. Service responds to the Client & Closes Appium service on given port

### Different actions wd/hub/session
Different action requests like: click, isDisplayed, swipe... requests are made for performing actions on mobile devices.

1. User sends correct action request to On-Demand service
2. On-Demand service finds port for given Session-ID
3. Service proxies given request to right port
4. Appium performs the action
5. Service responds to the Client 

## Executing tests against on-demand service
Users can use this service as a regular Appium service but when there are more than one device they need to use then there is no need of starting multiple services. On-Demand service will handle everything aroud that. It will start Appium service when POST request comes in and deletes the session on DELETE http request.

## Roadmap
* Basic Appium HTTP Handlers - In progress
* Port manager for Service - Not Started
* User interface for managing different connected devices - Planned
* Simulator/Emulator support
* Easier Simulator/Emulator creation
* ...
