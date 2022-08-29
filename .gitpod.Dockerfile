FROM gitpod/workspace-full:latest

RUN bash -c 'VERSION="14.8.0" \
    && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
    && nvm use $VERSION && nvm alias default $VERSION'

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

RUN sudo apt-get update
RUN sudo curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
RUN sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
RUN sudo curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
RUN sudo chmod 700 get_helm.sh
RUN sudo ./get_helm.sh
