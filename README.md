# Install using Docker-compose
  You have to provide all environement variables into your ``docker-compose.yaml``
  ```sh
    docker-compose up
  ```
# Install Stand alone

First install get front and back-end repositories
```sh 
  git clone https://github.com/kecsou/nodejs-bot.git
  git submodule update --init --recursive --remote
```

After build the front-end install the dependencies
```sh
  cd react-chatbot
  yarn install
```

Then build the front-end project

### Linux, macOS (Bash)
``` sh
  BUILD_PATH='./../public' serveradress=/ yarn run build
```

You have to provide a ``.env`` wich containe the following environnement variables

- googleApiKey (must be active for youtube, translate, and maps services)
- tmdbKey
- weatherstack
- port (optional default is 80)

And now you can run the nodejs server

```sh
  cd ..
  yarn install
  yarn start
```

Now open your browser on http://localhost
