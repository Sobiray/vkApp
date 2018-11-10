export default {
    getEvents: () => {
        return http(fetch('http://demo4492577.mockable.io/events'))
    },
    saveEvent: (event) => {
        const params = Object.keys(event).reduce((s, e, i) => (i === 0 ? e : s + '&' + e), '')
        return http(fetch('http://demo4492577.mockable.io/event?' + params, {
            method: 'PUT',
            //body: JSON.stringify(event)
        }))
    },
    savePayment: (userId, eventId, transactionId) => {
        const request = {
            userId,
            eventId,
            transactionId
        }
        const params = Object.keys(request).reduce((s, e, i) => (i === 0 ? e : s + '&' + e), '')
        return http(fetch('http://demo4492577.mockable.io/payment?' + params, {
            method: 'PUT',
            //body: JSON.stringify({
            //    userId,
            //    eventId,
            //    transactionId
            //})
        }))
    }
}

const http = (send) => {
    return send
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .catch(err => {
            err.text().then(msg => alert(msg))
        })
}