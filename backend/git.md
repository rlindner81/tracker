# stop autocrlf in local config
```
git config --local core.autocrlf false
```

# just amend latest changes
```
git add --all
git commit --amend --no-edit
git push --force
```
