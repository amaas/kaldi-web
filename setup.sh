#!/bin/bash

# Setup script

# Install Web Dependencies
# node.js
nodev=node-v0.10.26
wget http://nodejs.org/dist/v0.10.26/$nodev.tar.gz
tar -xvzf $nodev.tar.gz
rm -rf $nodev.tar.gz 
ln -s $nodev node
cd node
./configure
make
make install
