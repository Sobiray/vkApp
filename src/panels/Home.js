import React from 'react';
import PropTypes from 'prop-types';
import {Cell, List, Panel, ListItem, Button, Group, Div, Avatar, PanelHeader, Search} from '@vkontakte/vkui';
import '../css/style.css'

class Home extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            search: ''
        };

        //alert(JSON.stringify(props.events))
        //alert(JSON.stringify(this.state.filteredEvents))
    }

    onChange = (search) => {
        this.setState({ search });
    }

    render() {
        const props = this.props
        const filteredEvents = props.events.filter(event => {
            return event.info.name.indexOf(this.state.search) > -1
        })
        return (
            <Panel id={props.id}>
                <PanelHeader>Мероприятия</PanelHeader>
                {props.fetchedUser &&
                <Group title="User Data Fetched with VK Connect">
                    <ListItem
                        before={<Avatar src={props.fetchedUser.photo_200}/>}
                        description={props.fetchedUser.city.title}
                    >
                        {`${props.fetchedUser.first_name} ${props.fetchedUser.last_name}`}
                    </ListItem>
                </Group>}

                <Search value={this.state.search} onChange={this.onChange} style={{color: 'white'}}/>
                <Group>
                    <List>
                        {
                            filteredEvents.map(event => {
                                return (
                                    <Cell
                                        before={<Avatar src={event.info.photo_50}/>}
                                        onClick={() => props.goToEvent(event)}
                                    >
                                        {event.info.name}
                                    </Cell>)
                            })
                        }
                    </List>
                    <Div>
                        <Button size="xl" level="2" onClick={props.go} data-to="addEvent">
                            Добавить событие
                        </Button>
                    </Div>
                </Group>
            </Panel>
        );
    }
}

Home.propTypes = {
    id: PropTypes.string.isRequired,
    events: PropTypes.object.isRequired,
    go: PropTypes.func.isRequired,
    goToEvent: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

export default Home;
