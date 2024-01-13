#
# gp-webrtc/firebase
# Copyright (c) 2024, Greg PFISTER. MIT License.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of 
# this software and associated documentation files (the “Software”), to deal in 
# the Software without restriction, including without limitation the rights to 
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
# the Software, and to permit persons to whom the Software is furnished to do so, 
# subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all 
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS 
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
# 

FROM ghcr.io/gp-devenv/gp-node-devenv:22.04-20-1

# Switch back to root
USER root

# Set firebase-cli
COPY ./firebase-cli /usr/bin
RUN chmod ogu+x /usr/bin/firebase-cli

# Install Java
RUN apt-get update && \
    apt-get install -y -o DPkg::Options::=--force-confdef openjdk-19-jre-headless imagemagick && \
    apt-get autoclean -y && \
    apt-get autoremove -y

# Switch back to vscode user
USER vscode

# Set worksapce
WORKDIR /workspace

# Trust workspace
RUN git config --global --add safe.directory /workspace

# Expose ports
# EXPOSE 1883
EXPOSE 80
EXPOSE 5001
EXPOSE 8000
EXPOSE 8080
EXPOSE 9199

ENTRYPOINT ["sudo", "/entrypoint.sh"]

# End