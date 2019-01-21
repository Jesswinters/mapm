# Mapm
Mapm is a map making app that allows users to create and moderate curated lists of geographical data points. Think Wikipedia for maps.

## Contributors
[Jessica Winters](https://github.com/Jesswinters)  |
[Kamylla Almeida](https://github.com/KamyllaAlmeida) |
[Adam Romeo](https://github.com/arromeo)

## Prerequisites

- body-parser
- cookie-session
- dotenv
- express
- express-handlebars
- knex
- method-override
- morgan
- node-sass-middleware
- pg

This app requires Google Maps and Places API keys. The keys currently in the project are restricted and will not work on other hosts.

## Demo

![demo video of mapm](https://github.com/jesswinters/mapm/blob/master/docs/mapm_demo.gif?raw=true)

- Authorized users are able to make new maps and edit any current maps that exist on the server.
- App name, title and image can be entered for displaying the map in lists.
- To add a new point simply type the name or address of the location.
- The map expands as new points are added.
- To delete a point, find the point in the list and click 'Delete'.
- The map will remove the point and redraw the new bounds.

## Roadmap

Mapm was a five day project, but we would like to expand on it when time permits. Some of the features we've considered implementing:

1. Full login and authorization - Currently we have a dummy login system with only a couple pre-programmed users.
2. Moderation system - Like Wikipedia, our app is open to editing by any registered user. To prevent abuse and misuse of the app, would require a moderation system.
3. Map history - Goes hand-in-hand with moderation that changes to the map might need to be rolled back.
4. Featured maps - If something is in the headlines, a relevant map on the front page would be useful.
