@echo off

chdir .\\bin

bash --login -i -c 'ssh-host-config -y'
