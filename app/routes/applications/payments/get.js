import { paymentCollection} from '@root/database'
import getRole from '@helpers/users/getRole.js'

export default async (req, res) => {
    const { userId } = req.user.id
    const { page, limit } = req.query
    const pageNumber = parseInt(page)
    const limitRow = parseInt(limit)
    const total = (pageNumber - 1) * limitRow
    
    const role = await getRole(userId)
    if(role == 'admin'){
        if(pageNumber == 1){
            const payments =  await paymentCollection().orderBy('created').limit(limitRow).get()
            if(payments.empty) return res.send([])
            return res.send(payments.docs.map(doc => doc.data()))
        }
        const listPayments =  await paymentCollection().orderBy('created').limit(total).get()
        if(listPayments.empty) return res.send([])
        const lastPayment = listPayments.docs[listPayments.docs.length - 1]
        const payments = await paymentCollection().orderBy('created').startAfter(lastPayment.data().created).limit(limitRow).get()
        return res.send(payments.docs.map(doc => doc.data()))
    }else if(role == 'user'){
        if(pageNumber == 1){
            const payments = await paymentCollection().where('userId', '==', userId).orderBy('created').limit(limitRow).get()
            if(payments.empty) return res.send([])
            return res.send(payments.docs.map(doc => doc.data()))
        }
        const listPayments =  await paymentCollection().where('userId', '==', userId).orderBy('created').limit(total).get()
        if(listPayments.empty) return res.send([])
        const lastPayment = listPayments.docs[listPayments.docs.length - 1]
        const payments = await paymentCollection().where('userId', '==', userId).orderBy('created').startAfter(lastPayment.data().created).limit(limitRow).get()
        return res.send(payments.docs.map(doc => doc.data()))
    }else{
        return res.sendStatus(403)
    }
}