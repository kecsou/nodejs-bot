FROM node

LABEL MAINTAINER="kecsou"

RUN mkdir -p /chat/public

# Copy files
COPY . /chat
COPY docker-entrypoint.sh /

# Clone all sumbmodules
RUN cd /chat && \
  git submodule update --init --recursive --remote

# Build front-end assets
RUN cd /chat/react-chatbot && \
  yarn install && \
  SKIP_PREFLIGHT_CHECK=true yarn run build && \
  mv build/* /chat/public && \
  # Clean up before commit
  cd /chat && \
  rm -r react-chatbot

# Install nodejs server dependecies
RUN cd /chat && \
  yarn install

ENTRYPOINT ["docker-entrypoint.sh"]
