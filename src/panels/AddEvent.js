import React from 'react';
import PropTypes from 'prop-types';
import {Button, Div, Input, FormLayout, FormLayoutGroup, Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

class AddEvent extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            event: {}
        };
    }

    save = () => {
        this.props.goHome()
        //server.saveEvent(this.state.event).then(response => {
        //    this.props.goHome()
        //})
    }

    render() {
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
                            onChange={val => this.setState({event: {...event, id: val}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Цена, по которой гости смогут купить билет в период предзаказа</Div>
                        <Input
                            type="text" placeholder="Цена предзаказа в рублях"
                            onChange={val => this.setState({event: {...event, preorderPrice: val}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Цена, по которой гости смогут купить билет после окончания сбора минимально необходимой суммы</Div>
                        <Input
                            type="text" placeholder="Цена в рублях"
                            onChange={val => this.setState({event: {...event, price: val}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Дата, до которой требуется собрать минимальную сумму</Div>
                        <Input
                            type="text" placeholder="ДД.ММ.ГГГГ"
                            onChange={val => this.setState({event: {...event, deadline: val}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Минимальная сумма, которая потребуется для организации</Div>
                        <Input
                            type="text" placeholder="Сумма в рублях"
                            onChange={val => this.setState({event: {...event, requiredMoney: val}})}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup>
                        <Div>Плановая дата события</Div>
                        <Input
                            type="text" placeholder="ДД.ММ.ГГГГ"
                            onChange={val => this.setState({event: {...event, date: val}})}/>
                    </FormLayoutGroup>
                    <Button size="xl" level="2" onClick={this.save}>
                        Сохранить
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
};

export default AddEvent;
