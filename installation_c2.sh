#!/bin/bash

set -e

# Update package list
sudo apt update

# prereq
apt install cmake

mkdir /appsec/tools
cd /appsec/tools

# Install WhatWeb
# https://github.com/urbanadventurer/WhatWeb
sudo apt install -y whatweb

if command -v whatweb &>/dev/null; then
    echo "WhatWeb successfully installed."
else
    echo "Installation failed. Please check for errors."
fi

# Install waybackurls
# https://github.com/tomnomnom/waybackurls
go install github.com/tomnomnom/waybackurls@latest

if command -v waybackurls &>/dev/null; then
    echo "Waybackurls successfully installed."
else
    echo "Installation failed. Please check for errors."
fi

# Install gf
# https://github.com/tomnomnom/gf
go install github.com/tomnomnom/gf@latest

if command -v gf &>/dev/null; then
    echo "Waybackurls successfully installed."
else
    echo "Installation failed. Please check for errors."
fi

# install urldedupe
# https://github.com/ameenmaali/urldedupe
git clone https://github.com/ameenmaali/urldedupe.git

# install airixss
# https://github.com/ferreiraklet/airixss
go install github.com/ferreiraklet/airixss@latest
if command -v gf &>/dev/null; then
    echo "Waybackurls successfully installed."
else
    echo "Installation failed. Please check for errors."
fi

sudo apt install httpx-toolkit

go install github.com/channyein1337/jsleak@latest

git pull https://github.com/projectdiscovery/nuclei-templates
