#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# Update the VARIANT arg in docker-compose.yml to pick a Python version: 3, 3.8, 3.7, 3.6 
ARG VARIANT=3
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

ENV PYTHONUNBUFFERED 1
ENV REACT_NATIVE_PACKAGER_HOSTNAME="192.168.100.5"


# This image includes a non-root user with sudo access. Use the "remoteUser" 
# property in devcontainer.json to use it. On Linux, update the values below 
# or in docker-compose.yml to ensure the container user's UID/GID matches your
# local values. See https://aka.ms/vscode-remote/containers/non-root-user for details.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# [Optional] Update UID/GID if needed
RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then \
        groupmod --gid $USER_GID $USERNAME \
        && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
        && chmod -R $USER_UID:$USER_GID /home/$USERNAME; \
    fi


# [Optional] If your requirements rarely change, uncomment this section to add them to the image.
COPY server/requirements.txt /tmp/pip-tmp/
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
    && rm -rf /tmp/pip-tmp

# [Optional] Uncomment this section to install additional packages.

# Install node for building front-ends
RUN apt-get update \
    && apt-get -y install curl gnupg \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get -y install nodejs
#
# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get update \
#    && apt-get -y install --no-install-recommends <your-package-list-here> \
#    #
#    # Clean up
#    && apt-get autoremove -y \
#    && apt-get clean -y \
#    && rm -rf /var/lib/apt/lists/*
# ENV DEBIAN_FRONTEND=dialog

