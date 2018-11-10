export default {
    getEvents: () => {
        return fetch('http://demo4492577.mockable.io/events')
    },
    saveEvent: (event) => {
        return fetch('http://demo4492577.mockable.io/event', {
            method: 'PUT',
            body: JSON.stringify(event)
        })
    },
    savePayment: (userId, eventId, transactionId) => {
        return fetch('http://demo4492577.mockable.io/payment', {
            method: 'PUT',
            body: JSON.stringify({
                userId,
                eventId,
                transactionId
            })
        })
    }
}