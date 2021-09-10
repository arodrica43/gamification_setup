#!/bin/bash
# A sample Bash script, by Ryan
git status
git pull
git add .
git commit -m "Deploy"
git push origin main
echo "+ GamificationSetup-XBlock Git updated"