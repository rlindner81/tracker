launch.json

```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug backend",
      "outputCapture": "std",
      "program": "${workspaceFolder}/backend/src/server.js",
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug tests",
      "outputCapture": "std",
      "program": "${workspaceFolder}/backend/node_modules/jest/bin/jest.js",
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "test"
      },
      "disableOptimisticBPs": true
    }
  ]
}
```

tasks.json

```
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "type": "npm",
      "script": "serve",
      "path": "frontend/",
      "problemMatcher": []
    }
  ]
}
```
