import React from 'react';
import PropTypes from 'prop-types';
import {connect} from '../service/connect';
import {
    Avatar,
    CellButton,
    Cell,
    Div,
    Group,
    InfoRow,
    Link,
    List,
    ListItem,
    Panel,
    PanelHeader,
    HeaderButton,
    platform,
    IOS,
    Spinner
} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import server from '../service/server'

const osname = platform();

class Event extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            saving: false
        };
    }

    save = () => {
        const props = this.props;
        connect.makePayment(props.event, data => {
            this.setState({saving: true})
            server.savePayment(
                props.fetchedUser.id,
                props.event.eventId,
                data.result.transaction_id).then(res => {
                    this.setState({saving: false})
                    this.props.saveGuest(props.event.eventId, res)
            })
        })
    };

    renderButton = () => {
        if (this.state.saving) {
            return <Spinner/>
        }
        if (this.props.event.guestTxHash) {
            return <Link href={'https://rinkeby.etherscan.io/tx/' + this.props.event.guestTxHash}>Транзакция об оплате билета</Link>
        }
        return "Хочу пойти!"
    }

    render () {
        const props = this.props;
        //alert(JSON.stringify(props.event))
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={props.go} data-to="home">
                        {osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </HeaderButton>}
                >
                    Событие
                </PanelHeader>
                <Group>
                    <Cell
                        before={<Avatar src={props.event.group.photo_100} style={{width: 100}}/>}
                        description={props.event.group.place && props.event.group.place.title}
                    >{props.event.group.name}</Cell>
                    <Div>{props.event.group.description}</Div>
                    {
                        props.event.txHash
                            ? <Cell>
                                <Link href={'https://rinkeby.etherscan.io/tx/' + props.event.txHash}>Транзакция в
                                    смартконтракте</Link>
                            </Cell>
                            : null
                    }
                    <Cell>
                        <Link href={'https://vk.com/' + props.event.group.screen_name}>Перейти к группе</Link>
                    </Cell>
                </Group>
                <Group title="Информация о событии">
                    <List>
                        <Cell>
                            <InfoRow title="Цена предзаказа">{props.event.presalePrice}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Обычная цена">{props.event.salePrice}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Хотим собрать деньги до">{props.event.fundingDeadline}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Целевая сумма">{props.event.successSum}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Дата события">{props.event.eventDate}</InfoRow>
                        </Cell>
                        <Cell>
                            <InfoRow title="Максимальное число участников">{props.event.maxGuestsCount}</InfoRow>
                        </Cell>
                    </List>
                </Group>
                <Group>
                    <CellButton onClick={this.save}>
                        {this.renderButton()}
                    </CellButton>
                </Group>
                {
                    props.event.guests && props.event.guests.length > 0
                        ? <Group title="Уже идут">
                            {
                                props.event.guests.map(guest => (
                                    <ListItem
                                        before={<Avatar src={guest.photo_50}/>}
                                        description={guest.city && guest.city.title}
                                    >
                                        {`${guest.first_name} ${guest.last_name}`}
                                    </ListItem>
                                ))
                            }
                        </Group>
                        : null
                }
            </Panel>
        );
    }
}

Event.propTypes = {
    id: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    fetchedUser: PropTypes.object.isRequired,
    go: PropTypes.func.isRequired,
    saveGuest: PropTypes.func.isRequired,
};

export default Event;
