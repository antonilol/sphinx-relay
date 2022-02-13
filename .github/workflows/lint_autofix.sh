#!/bin/sh

git config --global user.name "Github Actions"
git commit -am "automatic linter fixes" || echo "All good, nothing fixed"
git push
