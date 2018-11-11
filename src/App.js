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
            selectedEvent: null,
            loading: true,
        };
    }

    componentDidMount () {
        this.reloadData();
    }

    reloadData = () => {
        this.setState({loading: true})
        // Запросим информацию по текущему пользователю
        connect.getUserInfo(data => {
            this.setState({fetchedUser: data});
        });

        // Получим список событий
        server.getEvents().then(eventsStr => {
            const events = JSON.parse(eventsStr)
            this.setState({serverEvents: events});
            // Запросим информацию о группах событий
            connect.getGroupsById(events.map(event => event.eventId), data => {
                const events = data.response.map(vkEvent => {
                    const event = this.state.serverEvents.find(e => e.eventId === vkEvent.screen_name);
                    return {group: vkEvent, ...event, guests: []}
                });
                this.setState({events, loading: false});

                // Объединим все массивы пользователей, купивших билеты на мероприятия, и запросим информацию сразу о всех
                const profileIds = [...new Set(this.state.serverEvents.reduce((s, e) => s.concat(e.guests), []))];
                connect.getProfilesById(profileIds, data => {
                    const profiles = data.response;
                    const events = this.state.events.map(event => {
                        const serverEvent = this.state.serverEvents.find(serverEvent => serverEvent.eventId === event.eventId);
                        return {
                            ...event,
                            guests: serverEvent.guests.map(guest => profiles.find(profile => profile.id.toString() === guest))
                        }
                    })
                    this.setState({
                        events: events
                    })
                    if (this.state.selectedEvent) {
                        this.setState({
                            selectedEvent: events.find(event => event.eventId === this.state.selectedEvent.eventId)
                        })
                    }
                })
            })
        }).catch(err => {
            this.setState({loading: false});
            alert(err)
            //alert(JSON.stringify(Object.keys(err)))
            //err.text().then(msg => {
            //    alert(JSON.stringify(msg))
            //})
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
                    goToEvent={this.goToEvent}
                    loading={this.state.loading}/>
                <Event id="event" event={state.selectedEvent} fetchedUser={state.fetchedUser} go={this.go} reload={this.reloadData}/>
                <AddEvent id="addEvent" go={this.go} goHome={this.goHome} reload={this.reloadData}/>
            </View>
        );
    }
}

export default App;
