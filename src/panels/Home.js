import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, Cell, CellButton, List, Panel, Button, Group, Div, FormLayout, option, PanelHeader, Search, Select} from '@vkontakte/vkui';
import '../css/style.css'

class Home extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            showFilters: false,
            category: '',
            search: ''
            //filters: {
            //    search: '',
            //    category: null
            //}
        };
    }

    onChange = (search) => {
        this.setState({ search });
    }

    toggleFilters = () => {
        this.setState({showFilters: !this.state.showFilters})
    }

    renderFilters = () => {
        return (
            <Group>
                <FormLayout>
                    <Select placeholder="Выберите категорию"
                            onChange={e => {this.setState({category: e.nativeEvent.target.value})}}
                            >
                        <option value="Музыка">Музыка</option>
                        <option value="Выставки">Выставки</option>
                        <option value="Танцы">Танцы</option>
                        <option value="Мастер-классы">Мастер-классы</option>
                    </Select>
                </FormLayout>
            </Group>

        )
    }

    render() {
        const props = this.props
        const state = this.state
        //alert(JSON.stringify(props.events))
        let filteredEvents = props.events;
        if (state.showFilters && state.search) {
            filteredEvents = filteredEvents.filter(event => {
                return event.group.name.indexOf(state.search) > -1
            })
        }
        if (state.showFilters && state.category) {
            filteredEvents = filteredEvents.filter(event => {
                return event.group.description.indexOf(state.category) > -1
            })
        }
        return (
            <Panel id={props.id}>
                <PanelHeader>Мероприятия</PanelHeader>
                <Search value={this.state.search} onChange={this.onChange} style={{color: 'white'}}/>
                <Group>
                    <CellButton onClick={this.toggleFilters}>Фильтры</CellButton>
                </Group>
                {
                    state.showFilters && this.renderFilters()
                }
                <Group>
                    <List>
                        {
                            filteredEvents.map(event => {
                                return (
                                    <Cell
                                        before={<Avatar src={event.group.photo_50}/>}
                                        onClick={() => props.goToEvent(event)}
                                    >
                                        {event.group.name}
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
