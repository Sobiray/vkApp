import React from 'react';
import connect from '@vkontakte/vkui-connect';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import server from './service/server'
import {Settings} from './settings';

import Home from './panels/Home';
import Persik from './panels/Persik';
import AddEvent from './panels/AddEvent';

class App extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activePanel: 'home',
            fetchedUser: null,
            serverEvents: [],
            events: []
        };
    }

    componentDidMount () {

        connect.subscribe((e) => {
            console.log('e.detail:', e.detail)
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({fetchedUser: e.detail.data});
                    break;
                case 'VKWebAppCallAPIMethodResult': {
                    const events = e.detail.data.response.map(vkEvent => {
                        const event = this.state.serverEvents.find(e => e.id === vkEvent.screen_name);
                        return {info: vkEvent, ...event}
                    })
                    this.setState({events});
                    break;
                }
                default:
                	console.log(e.detail);
            }
        });

        server.getEvents().then(response => {
            response.json().then(events => {
                this.setState({serverEvents: events})
                const group_ids = events.reduce((s, e, i) => (i === 0 ? e.id : s+','+e.id), '');
                connect.send("VKWebAppCallAPIMethod",
                    {
                        "method": "groups.getById",
                        "params": {
                            "group_ids": group_ids,
                            "v": Settings.VK_API_VERSION,
                            "access_token": Settings.APP_ACCESS_TOKEN
                        }
                    });
            })
        })
    }

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    goToAddEvent = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    }

    render () {
        return (
            <View>
                <View activePanel={this.state.activePanel}>
                    <Home
                        id="home"
                        events={this.state.events}
                        fetchedUser={this.state.fetchedUser}
                        go={this.go}
                        goToAddEvent={this.goToAddEvent}/>
                    <Persik id="persik" go={this.go}/>
                    <AddEvent id="addEvent" go={this.goToAddEvent}/>
                </View>
            </View>
        );
    }
}

export default App;
