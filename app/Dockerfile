FROM node:slim
ENV DEBIAN_FRONTEND=noninteractive SUDO_FORCE_REMOVE=yes
COPY . /app/
RUN useradd -d /app app && \
    chown -R app:app /app && \
    apt-get update && \
    apt-get install -y \
        bzip2 \
        libfontconfig1 \
        libfreetype6 \
        sudo \
      && \
    sudo -u app sh -c 'cd ~; npm install' && \
    apt-get remove --purge -y bzip2 sudo && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/*
USER app
WORKDIR /app
CMD node index.js
EXPOSE 9801
