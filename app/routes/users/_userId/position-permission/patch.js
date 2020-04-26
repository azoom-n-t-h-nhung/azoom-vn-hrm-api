import { isAdmin } from '@helpers/check-rule'
import getUserById from '@routes/users/_userId/get'
import saveUser from '@routes/users/put'

module.exports = async (req, res) => {
  const { userId } = req.params
  if (!isAdmin(req.user.positionPermissionId)) {
    return res.sendStatus(403)
  }
  const { positionPermissionId = 4 } = req.body
  const user = await execute(getUserById, { params: { userId } })
  if (user) {
    user.positionPermissionId = positionPermissionId
    await execute(saveUser, { body: user })
    res.send(user)
  }
  res.sendStatus(400)
}
