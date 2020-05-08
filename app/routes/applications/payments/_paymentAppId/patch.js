import { paymentCollection } from '@root/database'
import getRole from '@helpers/users/getRole.js'
import { status }  from '@constants/index.js'
import initNewApprovalUser from '@helpers/users/initNewApprovalUser.js'

export default async (req, res) => {
  const userId = req.user.id
  const { paymentAppId } = req.params
  const { isApproved = false } = req.query
  const payment = await paymentCollection().doc(paymentAppId).get()
  if (!payment.exists) return res.sendStatus(404)
  if (payment.data().status != status.inPending) return res.sendStatus(400)
  
  const role = await getRole(userId)
  if (!role.includes('admin')) return res.sendStatus(403)

  const newApprovalUsers = await initNewApprovalUser(userId, isApproved)
  const updatePaymentApp = {
    updated: new Date(),
    status: (isApproved) ? 1 : 0,
    approvalUsers: [ 
      newApprovalUsers
    ]
  }
  await paymentCollection().doc(paymentAppId).update(updatePaymentApp)
  return res.sendStatus(200)
}
