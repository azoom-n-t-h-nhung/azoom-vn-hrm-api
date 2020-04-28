import { paymentCollection} from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  const { userId } = req.user.id
  let { page, limit } = req.query

  // TODO: page, limit must be greater than 0  (handle be OpenAPI)
  // TODO: remove 2 line parser below when openAPI is applied
  page = parseInt(page)
  limit = parseInt(limit)
  const total = (page - 1) * limit

  const role = await getRole(userId)
  if(role !== 'user' && role !== 'admin') return res.sendStatus(403) 

  let connectionGetAll = paymentCollection().orderBy('created')
  let connection = paymentCollection().orderBy('created').limit(limit)

  if (role == 'user') {
    connectionGetAll = connectionGetAll.where('userId', '==', userId)
    connection = connection.where('userId', '==', userId)
  }
  const getAllPayments = await connectionGetAll.get()
  const count = getAllPayments.docs.length
  
  if (page === 1) {
    const payments =  await connection.get()
    if(payments.empty) return res.send({ count, 'data': []})
    return res.send({
      count, 
      'data': payments.docs.map(doc => doc.data())
    })
  }

  const lastPayment = getAllPayments.docs[total - 1]
  const payments = await connection.startAfter(lastPayment.data().created).get()
  return res.send({
    count, 
    'data': payments.docs.map(doc => doc.data())
  })
}
