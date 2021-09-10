#!/bin/bash
# A sample Bash script, by Ryan
to=~/Documentos/feina/dev/deploy/gamificationsetup-xblock/
cp -r gamification_setup $to
cp -r gamification_setup_xblock.egg-info $to
cp LICENSE $to
cp requirements.txt $to
cp README.md $to
cp setup.py $to
cd ~/Documentos/feina/dev/deploy/gamificationsetup-xblock/
echo "+ GamificationSetup-XBlock local dir updated"
git status
git pull
git add .
git commit -m "Automatic Production Deploy"
git push origin master
echo "+ GamificationSetup-XBlock GitLab updated"