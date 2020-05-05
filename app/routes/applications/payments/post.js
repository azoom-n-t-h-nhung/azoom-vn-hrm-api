import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
  const userId = req.user.userId
  const payment = req.body

  const role = await getRole(userId)
  if(!['admin', 'editor'].includes(role)) return res.sendStatus(403)

  const checkPayment = await paymentCollection().doc(payment.id).get()
  if (checkPayment.exists) return res.sendStatus(400)

  const defaultPayment = {
    id : '',
    status : -1,
    reason : '',
    amount : '',
    isActive : false,
    userId : '',
    created : new Date(),
    updated: new Date()
  }
  const newPayment = {...defaultPayment, ...payment}
  await paymentCollection().doc(newPayment.id).set(newPayment)
  return res.send(newPayment)
}
