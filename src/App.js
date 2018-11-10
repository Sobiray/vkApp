import React from 'react';
import {connect} from './service/connect';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import server from './service/server'

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

        // Запросим информацию по текущему пользователю
        connect.getUserInfo(data => {
            this.setState({fetchedUser: data});
        });

        // Получим список событий
        server.getEvents().then(response => {
            response.json().then(events => {
                this.setState({serverEvents: events})
                // Запросим информацию о группах событий
                connect.getGroupsById(events.map(event => event.id), data => {
                    const events = data.response.map(vkEvent => {
                        const event = this.state.serverEvents.find(e => e.id === vkEvent.screen_name);
                        return {info: vkEvent, ...event, guests: []}
                    });
                    this.setState({events});

                    // Объединим все массивы пользователей, купивших билеты на мероприятия, и запросим информацию сразу о всех
                    const profileIds = [...new Set(this.state.serverEvents.reduce((s, e) => s.concat(e.guests), []))];
                    connect.getProfilesById(profileIds, data => {
                        const profiles = data.response;
                        this.setState({
                            events: this.state.events.map(event => {
                                const serverEvent = this.state.serverEvents.find(serverEvent => serverEvent.id === event.id);
                                return {
                                    ...event,
                                    guests: serverEvent.guests.map(guest => profiles.find(profile => profile.id == guest))
                                }
                            })
                        })
                    })
                })
            })
        })
    }

    // Перейти на страницу, указанную в data-to
    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    // Вернуться на домашнюю страницу
    goHome = () => {
        this.setState({activePanel: 'home'})
    };

    // Перейти на страницу Event
    goToEvent = (event) => {
        this.setState({selectedEvent: event, activePanel: "event"})
    };

    render () {
        const state = this.state;
        return (
            <View activePanel={state.activePanel}>
                <Home
                    id="home"
                    events={state.events}
                    fetchedUser={state.fetchedUser}
                    go={this.go}
                    goToEvent={this.goToEvent}/>
                <Event id="event" event={state.selectedEvent} fetchedUser={state.fetchedUser} go={this.go}/>
                <AddEvent id="addEvent" go={this.go} goHome={this.goHome}/>
            </View>
        );
    }
}

export default App;
