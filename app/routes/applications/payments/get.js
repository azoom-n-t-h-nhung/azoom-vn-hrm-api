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
  if (role == 'admin') {
    let connection = paymentCollection().orderBy('created')
    const getAllPayments = await connection.get()
    const count = getAllPayments.docs.length
    if (page === 1) {
      const payments =  await connection.limit(limit).get()
      if(payments.empty) return res.send({'count': count, 'data': []})
      return res.send({
        'count': count, 
        'data': payments.docs.map(doc => doc.data())
      })
    }
    const lastPayment = getAllPayments.docs[total - 1]
    const payments = await connection.startAfter(lastPayment.data().created).limit(limit).get()
    return res.send({
      'count': count, 
      'data': payments.docs.map(doc => doc.data())
    })
  } else if (role == 'user') {
    let connection = paymentCollection().where('userId', '==', userId).orderBy('created')
    const getAllPayments = await connection.get()
    const count = getAllPayments.docs.length
    if (page === 1) {
      const payments = await connection.limit(limit).get()
      if(payments.empty) return res.send({'count': count, 'data': []})
      return res.send({
        'count': count, 
        'data': payments.docs.map(doc => doc.data())
      })
    }
    const lastPayment = getAllPayments.docs[total - 1]
    const payments = await connection.startAfter(lastPayment.data().created).limit(limit).get()
    return res.send({
      'count': count, 
      'data': payments.docs.map(doc => doc.data())
    })
  } else {
    return res.sendStatus(403)
  }
}
