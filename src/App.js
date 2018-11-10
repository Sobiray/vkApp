import React from 'react';
import connect from '@vkontakte/vkui-connect';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import server from './service/server'
import {Settings} from './settings';

import Home from './panels/Home';
import Event from './panels/Event';
import AddEvent from './panels/AddEvent';

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activePanel: 'home',
            fetchedUser: null,
            serverEvents: [],
            events: [],
            selectedEvent: null
        };
    }

    componentDidMount () {

        connect.subscribe((e) => {
            console.log('e.detail:', e.detail)
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    //alert(JSON.stringify(e.detail))
                    this.setState({fetchedUser: e.detail.data});
                    break;
                case 'VKWebAppCallAPIMethodResult': {
                    //alert(JSON.stringify(e.detail))
                    //alert(e.detail.data.request_id);
                    if (e.detail.data.request_id === 'groups.getById') {
                        const events = e.detail.data.response.map(vkEvent => {
                            const event = this.state.serverEvents.find(e => e.id === vkEvent.screen_name);
                            return {info: vkEvent, ...event, guests: []}
                        })
                        this.setState({events});
                        //alert(JSON.stringify(events))
                        const profileIds = [...new Set(this.state.serverEvents.reduce((s, e) => s.concat(e.guests), []))];
                        const user_ids = profileIds.reduce((s, e, i) => (i === 0 ? e : s + ',' + e), '');
                        //alert('user_ids:' + JSON.stringify(user_ids))
                        connect.send("VKWebAppCallAPIMethod",
                            {
                                method: "users.get",
                                params: {
                                    user_ids: user_ids,
                                    fields: 'photo_50,city',
                                    v: Settings.VK_API_VERSION,
                                    access_token: Settings.APP_ACCESS_TOKEN
                                },
                                request_id: "users.get"
                            });

                        //alert(JSON.stringify(events))
                    } else if (e.detail.data.request_id === 'users.get') {
                        const profiles = e.detail.data.response;
                        alert(JSON.stringify(profiles))
                        this.setState({
                            events: this.state.events.map(event => {
                                const serverEvent = this.state.serverEvents.find(serverEvent => serverEvent.id === event.id);
                                alert(JSON.stringify(serverEvent.guests))
                                return {
                                    ...event,
                                    guests: serverEvent.guests.map(guest => profiles.find(profile => profile.id == guest))
                                }
                            })
                        })
                    }
                    break;
                }
                case 'VKWebAppOpenPayFormResult': {
                    //alert(JSON.stringify(e.detail))
                    //alert(JSON.stringify(this.state.selectedEvent))
                    server.savePayment(
                        this.state.fetchedUser.id,
                        this.state.selectedEvent.id,
                        e.detail.data.transaction_id)
                    break;
                }
                case 'VKWebAppOpenPayFormFailed': {
                    alert(JSON.stringify(e.detail))
                    break;
                }
                default:
                    console.log(e.detail);
            }
        });

        connect.send("VKWebAppGetUserInfo", {});

        server.getEvents().then(response => {
            response.json().then(events => {
                this.setState({serverEvents: events})
                const group_ids = events.reduce((s, e, i) => (i === 0 ? e.id : s + ',' + e.id), '');
                connect.send("VKWebAppCallAPIMethod",
                    {
                        method: "groups.getById",
                        params: {
                            "group_ids": group_ids,
                            "v": Settings.VK_API_VERSION,
                            "access_token": Settings.APP_ACCESS_TOKEN
                        },
                        request_id: "groups.getById"
                    });
            })
        })
    }

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    }

    goHome = () => {
        this.setState({activePanel: 'home'})
    }

    goToEvent = (event) => {
        alert(JSON.stringify(event))
        this.setState({selectedEvent: event})
        this.setState({activePanel: "event"})
    }

    render () {
        return (
            <View activePanel={this.state.activePanel}>
                <Home
                    id="home"
                    events={this.state.events}
                    fetchedUser={this.state.fetchedUser}
                    go={this.go}
                    goToEvent={this.goToEvent}/>
                <Event id="event" event={this.state.selectedEvent} go={this.go}/>
                <AddEvent id="addEvent" go={this.go} goHome={this.goHome}/>
            </View>
        );
    }
}

export default App;
