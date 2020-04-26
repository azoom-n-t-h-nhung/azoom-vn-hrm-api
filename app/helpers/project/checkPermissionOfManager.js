import getProject from '@routes/projects/get.js'
import { execute } from '@root/util.js'

export default async function (managerId, memberId) {
  const projects = await execute(getProject, { query: { managerId, memberId } })
  return projects.length ? true : false
}
