#!/usr/bin/env node

'use strict'
var argv = require('minimist')(process.argv.slice(2))
var rest = require('restler')
var SPM = require('spm-metrics-js')
var os = require('os')
var Logsene = require('logsene-js')
var logger = new Logsene(process.env.LOGSENE_TOKEN || argv.l, 'pending_tasks')

var spmClient = new SPM(process.env.SPM_TOKEN || argv.s, 20000)
var pendingTaskMetric = spmClient.getCustomMetric({
  // name of the metric
  name: 'pendingTasks',
  // aggregation type
  aggregation: 'avg',
  // filter value in SPM User Interface, e.g. hostname
  filter1: os.hostname(),
// auto-save metrics in the given interval
interval: 30000})

var pendingTaskTimeMetric = spmClient.getCustomMetric({
  // name of the metric
  name: 'pendingTasksTime',
  // aggregation type
  aggregation: 'avg',
  // filter value in SPM User Interface, e.g. hostname
  filter1: os.hostname(),
// auto-save metrics in the given interval
interval: 30000})

var ptHistorgram = pendingTaskMetric.histogram()
var pttHistogram = pendingTaskTimeMetric.histogram()

setInterval(function () {
  rest.get(argv.e + '/_cluster/pending_tasks/').on('complete', function (result) {
    if (result instanceof Error) {
      console.log('Error:', result.message)
    } else {
      // console.log(result)
      var count = result.tasks.length
      ptHistorgram.update(count)
      // console.log('Pending Tasks:' + count)
      if (count === 0) {
        return
      }
      for (var i = 0; i < count; i++) {
        pttHistogram.update(result.tasks[i].time_in_queue_millis / 1000) // seconds instead of ms
        logger.log('info', result.tasks[i].source, result.tasks[i])
      }
    }
  })
}, 10000)
