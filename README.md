# es-pending-task-monitor
Monitors pending tasks in Elasticserach with SPM custom metrics + logging of pending tasks to Logsene

Install:
```
npm i megastef/es-pending-task-monitor -g
```

Run:
```
es-pending-tasks-monitor -e http://localhost:9200 -l LOGSENE_TOKEN -s SPM_TOKEN
```


Linux Upstart script:
```
description "Upstart Elasticsearch Pending-Tasks Monitor"

start on (local-filesystems and net-device-up IFACE=eth0)
stop on runlevel [!12345]

respawn

#setuid syslog
#setgid syslog
env NODE_ENV=production

exec es-pending-tasks-monitor -e http://localhost:9200 -l LOGSENE_TOKEN -s SPM_TOKEN
```

References:
- [Logsene](http://sematext.com/logsene/index.html) - Hosted ELK Stack and Alerts
- [logsene-js](https://www.npmjs.com/package/logsene-js)
- [SPM Custom Metrics for Node.js](http://blog.sematext.com/2015/04/14/nodejs-iojs-custom-metrics/)


