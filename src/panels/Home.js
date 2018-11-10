import React from 'react';
import PropTypes from 'prop-types';
import { CellButton, Panel, ListItem, Button, Group, Div, Avatar, PanelHeader } from '@vkontakte/vkui';
import '../css/style.css'

const Home = props => (
	<Panel id={props.id}>
		<PanelHeader>Sobiray</PanelHeader>
		{props.fetchedUser &&
		<Group title="User Data Fetched with VK Connect">
			<ListItem
				before={<Avatar src={props.fetchedUser.photo_200}/>}
				description={props.fetchedUser.city.title}
			>
				{`${props.fetchedUser.first_name} ${props.fetchedUser.last_name}`}
			</ListItem>
		</Group>}

		<Group title="Мероприятия" className="homePanelGroup">
			{
				props.events.map(event => {
                    return (<CellButton onClick={() => {
                    }}>
                        {event.info.name}
                    </CellButton>)
                })
			}
            <Div>
                <Button size="xl" level="2" onClick={props.goToAddEvent} data-to="addEvent">
                    Добавить мероприятие
                </Button>
            </Div>
		</Group>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	events: PropTypes.object.isRequired,
	go: PropTypes.func.isRequired,
    goToAddEvent: PropTypes.func.isRequired,
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
