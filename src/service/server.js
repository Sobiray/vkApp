//const host = 'http://demo4492577.mockable.io';
//const host = 'http://172.20.38.19:8080';
//const host = 'http://localhost:8080';
const host = 'http://172.20.39.39:8080';
//const host = 'https://glacial-falls-63283.herokuapp.com'

export default {
    getEvents: () => {
        return http(fetch(host + '/events'))
    },
    saveEvent: (event) => {
        const params = Object.keys(event).reduce((s, e, i) => (i === 0 ? e : s + '&' + e), '')
        return http(fetch(host + '/event?' + params, {
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
        return http(fetch(host + '/payment?' + params, {
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
            return response.text();
        })
        .catch(err => {
            console.log(err)
            if (err.text) {
                err.text().then(msg => alert(msg))
            } else {
                alert(JSON.stringify(err))
            }
        })
}