import React from 'react';
import PropTypes from 'prop-types';
import {Avatar, CellButton, Cell, Group, InfoRow, Link, List, Panel, PanelHeader, HeaderButton, platform, IOS} from '@vkontakte/vkui';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';

const osname = platform();

const Event = props => (
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
            <CellButton onClick={() => {}}>Хочу пойти!</CellButton>
        </Group>
    </Panel>
);

Event.propTypes = {
    id: PropTypes.string.isRequired,
    event: PropTypes.object.isRequired,
    go: PropTypes.func.isRequired,
};

export default Event;
