import React from 'react';
import PropTypes from 'prop-types';
import {connect} from '../service/connect';
import {Avatar, CellButton, Cell, Group, InfoRow, Link, List, ListItem, Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import server from '../service/server'

const osname = platform();

class Event extends React.Component {

    constructor (props) {
        super(props);
    }

    save = () => {
        const props = this.props;
        connect.makePayment(props.event, data => {
            server.savePayment(
                props.fetchedUser.id,
                props.event.id,
                data.transaction_id)
        })
    };

    render() {
        const props = this.props;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={props.go} data-to="home">
                        {osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </HeaderButton>}
                >
                    {props.event.info.name}
                </PanelHeader>
                <Group>
                    <Cell
                        before={<Avatar src={props.event.info.photo_100} style={{width: 100}}/>}
                    >
                        <Link href={'https://vk.com/' + props.event.info.screen_name}>Перейти к группе</Link>
                    </Cell>
                </Group>
                <Group title="Информация о событии">
                    <List>
                        <Cell>
                            <InfoRow title="Цена предзаказа">{props.event.preorderPrice}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Обычная цена">{props.event.price}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Хотим собрать деньги до">{props.event.deadline}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Целевая сумма">{props.event.requiredMoney}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Дата события">{props.event.date}</InfoRow>
                        </Cell>
                    </List>
                </Group>
                <Group>
                    <CellButton onClick={this.save}>Хочу пойти!</CellButton>
                </Group>
                <Group title="Уже идут">
                    {
                        props.event.guests.map(guest => (
                            <ListItem
                                before={<Avatar src={guest.photo_50}/>}
                                description={guest.city.title}
                            >
                                {`${guest.first_name} ${guest.last_name}`}
                            </ListItem>
                        ))
                    }
                </Group>
            </Panel>
        );
    }
}

Event.propTypes = {
    id: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    fetchedUser: PropTypes.object.isRequired,
    go: PropTypes.func.isRequired,
};

export default Event;
