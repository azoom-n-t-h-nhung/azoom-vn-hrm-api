import { execute } from '@root/util'
import saveLeaveApplication from '@routes/applications/leaves/put.js'
import * as constants from '@root/constants/index'
import { parse, eachDayOfInterval, format } from 'date-fns/fp'

module.exports = async (req, res) => {
  const { startDate, endDate, leaveTypeId, userId, requiredContent } = req.body

  const requiredDates = eachDayOfInterval({
    start: parse(new Date(), 'yyyy/MM/dd', startDate),
    end: parse(new Date(), 'yyyy/MM/dd', endDate),
  }).map((date) => format('yyyy/MM/dd', date))
  const data = {
    id: setId(userId),
    userId,
    requiredDates,
    requiredContent,
    leaveTypeId,
    createdDate: new Date(),
    status: constants.status.inPending,
    isActive: true,
  }
  const result = await execute(saveLeaveApplication, { body: data })
  return res.send(result)
}
const setId = (id) => {
  return id + format('yyyyMMddHHmmss', new Date())
}
