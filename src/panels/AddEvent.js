import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Div,
    Input,
    FormLayout,
    FormLayoutGroup,
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

class AddEvent extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            event: {},
            saving: false
        };
    }

    save = () => {
        this.setState({saving: true})
        server.saveEvent(this.state.event)
            .then(response => {
                alert(response)
                this.setState({saving: false})
                this.props.saveEvent({...this.state.event, txHash: response})
                this.props.goHome()
            })
            .catch(err => {
                this.setState({saving: false})
            })
    }

    render () {
        const props = this.props;
        const event = this.state.event;
        return (
            <Panel id={props.id}>
                <PanelHeader
                    left={<HeaderButton onClick={props.go} data-to="home">
                        {osname === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </HeaderButton>}
                >
                    Добавить событие
                </PanelHeader>
                <FormLayout>
                    <FormLayoutGroup>
                        <Div>Введите идентификатор вашей группы ВК</Div>
                        <Input
                            type="text" placeholder="Идентификатор"
                            onChange={e => this.setState({event: {...event, eventId: e.nativeEvent.target.value}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Цена, по которой гости смогут купить билет в период предзаказа</Div>
                        <Input
                            type="text" placeholder="Цена предзаказа в рублях"
                            onChange={e => this.setState({
                                event: {
                                    ...event,
                                    presalePrice: e.nativeEvent.target.value
                                }
                            })}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Цена, по которой гости смогут купить билет после окончания сбора минимально необходимой
                            суммы</Div>
                        <Input
                            type="text" placeholder="Цена в рублях"
                            onChange={e => this.setState({event: {...event, salePrice: e.nativeEvent.target.value}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Дата, до которой требуется собрать минимальную сумму</Div>
                        <Input
                            type="text" placeholder="ГГГГ-ММ-ДД"
                            onChange={e => this.setState({
                                event: {
                                    ...event,
                                    fundingDeadline: e.nativeEvent.target.value
                                }
                            })}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Минимальная сумма, которая потребуется для организации</Div>
                        <Input
                            type="text" placeholder="Сумма в рублях"
                            onChange={e => this.setState({event: {...event, successSum: e.nativeEvent.target.value}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Плановая дата события</Div>
                        <Input
                            type="text" placeholder="ГГГГ-ММ-ДД"
                            onChange={e => this.setState({event: {...event, eventDate: e.nativeEvent.target.value}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Максимальное число участников</Div>
                        <Input
                            type="text" placeholder="Количество человек"
                            onChange={e => this.setState({
                                event: {
                                    ...event,
                                    maxGuestsCount: e.nativeEvent.target.value
                                }
                            })}/>
                    </FormLayoutGroup>
                    <Button size="xl" level="2" onClick={this.save}>
                        {this.state.saving ? <Spinner/> : "Сохранить"}
                    </Button>
                </FormLayout>
            </Panel>
        )
    }
}

AddEvent.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    goHome: PropTypes.func.isRequired,
    saveEvent: PropTypes.func.isRequired,
};

export default AddEvent;
