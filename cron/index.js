const CronJob = require('cron').CronJob
const CronTime = require('cron').CronTime

// const a = new CronJob(
//   '*/4 * * * * *',
//   function () {
//     run() // function called inside cron
//   },
//   null,
//   false
// )

// let run = () => {
//   console.log('function called')
// }

// let scheduler = () => {
//   console.log('CRON JOB STARTED WILL RUN IN EVERY 4 SECOND')
//   a.start()

//   a.stop()

//   a.setTime(new CronTime(input))

/*
Cron Ranges:
When specifying your cron values you'll need to make sure that your values fall within the ranges. For instance, some cron's use a 0-7 range for the day of week where both 0 and 7 represent Sunday. We do not. And that is an optimisation.

Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)
*/

/*
Query1: `Select id, end_date from products where end_date IS NOT NULL and end_date > now() group by end_date order by end_date`

Query2: `Select id, end_date from products where end_date IS NOT NULL and end_date <= now() and date_triggered = false group by end_date order by end_date`


`Select p.price, p.discount_percent, p.price - (p.discount_percent / 100  * p.price) as discount_price, p.start_date, p.end_date from cart inner join product on product.sku = cart.sku`

*/

/*
Lets say we have 10 products. Each product is having different discount dates. 



Scenario 1:
 When the server starts, we need to get the discount end dates from DB ( use group by enddate ) that are greater than the current date and add a cron for each end date.

 What we can do is , we can store the dates in an array that is scheduled by cron.

Scenario 2:
 When we change the discount end dates that is already in cron,

 1) If the end date is changed and less than the current date, then we should remove that cron and remove that date from array.
 2) If the end date is changed and greater than the current date, then we should replace that cron date and replace that date in array.

*/

global._timestamps = []
global._cronObj = {}
global._unusedCrons = []

_timestamps = Array.from({ length: 11 }).map((_, i) => {
  const currentTime = new Date()
  const expirationTime = new Date(currentTime.getTime() + (i + 1) * 5 * 1000)
  return expirationTime.toISOString()
})

Array.from({ length: 5 }, (_, i) => {
  // Max of 5 cron jobs for product discount dates
  if (_timestamps[i]) {
    const cronTime = new Date(_timestamps[i])
    const newJob = new CronJob(
      cronTime,
      null, // onTick
      null, // onComplete
      true
    )
    newJob.addCallback(function () {
      console.log('Some operations on this time', cronTime)
      handleFinishedJobs(cronTime)
    })
    _cronObj[cronTime.toISOString()] = {
      cronJob: newJob,
    }

    // if (i % 2 !== 0) {
    //   replaceTimeStamp(cronTime, new Date(cronTime.getTime() + 2 * 1000), 2)
    // }
  } else {
    const newJob = new CronJob(
      '* * * * * *',
      null, // onTick
      null, // onComplete
      false
    )

    _unusedCrons.push(newJob)
  }
})

function handleFinishedJobs(cronTime) {
  const cronTimeString = new Date(cronTime).toISOString()
  _cronObj[cronTimeString].cronJob.stop()
  _cronObj[cronTimeString].cronJob._callbacks.length = 0 // emptying the callbacks array

  const cronTimeArrayIndex = _timestamps.indexOf(cronTimeString)
  if (cronTimeArrayIndex !== -1) {
    _timestamps.splice(cronTimeArrayIndex, 1)
  }
  _unusedCrons.push(_cronObj[cronTimeString].cronJob)
  delete _cronObj[cronTimeString]

  checkAndAddNewTime()
}

// Always maintain _timestamp array in ascending order

function checkAndAddNewTime() {
  const _timestampObjs = Object.keys(_cronObj)
  const loopLength = _timestamps.length < 5 ? _timestamps.length : 5
  for (let i = 0; i < loopLength; i++) {
    if (_timestampObjs.includes(_timestamps[i])) {
      continue
    } else {
      console.log('_timestamps[i]', _timestamps[i])
      if (_timestamps[i] && _unusedCrons.length > 0) {
        const cronTime = new Date(_timestamps[i])
        const newJob = _unusedCrons.pop()
        newJob.setTime(new CronTime(cronTime))
        newJob.addCallback(function () {
          console.log('Some operations on this time', cronTime)
          handleFinishedJobs(cronTime)
        })
        newJob.start()
        _cronObj[cronTime.toISOString()] = {
          cronJob: newJob,
        }
      }
    }
  }
}

function replaceTimeStamp(from, to) {
  const fromTimeStamp = new Date(from).toISOString()
  const toTimeStamp = new Date(to).toISOString()

  const index = _timestamps.indexOf(fromTimeStamp)

  if (index !== -1 && _cronObj[fromTimeStamp]) {
    const job = _cronObj[fromTimeStamp].cronJob
    job.stop()
    job._callbacks.length = 0 // emptying the callbacks array
    delete _cronObj[fromTimeStamp]

    job.setTime(new CronTime(new Date(to)))
    job.addCallback(function () {
      console.log('Some operations on this time', toTimeStamp)
      handleFinishedJobs(toTimeStamp)
    })
    job.start()

    _timestamps[index] = toTimeStamp
    _cronObj[toTimeStamp] = {
      cronJob: job,
    }
  }
}

// insert in timestamp array
// pop the last cronjob and start new time stamp

// function addTimeStamp(newTimestamp) {
//   const IsoTimestamp = new date(newTimestamp).toISOString()

// }

// And you need to account for discount start date

/*
Scenarios:

1) I can add new start and end date
2) Once added i can edit the start and end date
    2.1) Editting the valid (ongoing) start date to future start date ( to postpone the discount)
    2.2) Editting the valid (ongoing) end date to past end date ( to end the discount)

    2.3) Editting the valid (ongoing) start date to another valid start date
    2.4) Editting the valid (ongoing) end date to another valid end date 


Procedures:

1) Either if we add a new date or of edit the dates, we need to get all the start date and end date using the query
Query: `Select id, start_date, end_date from products where end_date > now() group by end_date order by end_date`


*/

/*
 https://api.mamaearth.in/v1/products/shopAllProducts?pagenumber=1&pagesize=20&categoryId=51
*/
