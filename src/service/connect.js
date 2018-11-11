import VKConnect from '@vkontakte/vkui-connect';
import {Settings} from '../settings';

const subscribers = {}

export const connect = {
    getUserInfo: (callback) => {
        VKConnect.send("VKWebAppGetUserInfo", {});
        subscribers['VKWebAppGetUserInfoResult'] = callback;
    },
    getGroupsById: (groupIds, callback) => {
        const group_ids = groupIds.reduce((s, e, i) => (i === 0 ? e : s + ',' + e), '');
        VKConnect.send("VKWebAppCallAPIMethod",
            {
                method: "groups.getById",
                params: {
                    group_ids: group_ids,
                    fields: 'place,description',
                    v: Settings.VK_API_VERSION,
                    access_token: Settings.APP_ACCESS_TOKEN
                },
                request_id: "groups.getById"
            }
        );
        subscribers['VKWebAppCallAPIMethodResult:groups.getById'] = callback;
    },
    getProfilesById: (profileIds, callback) => {
        const user_ids = profileIds.reduce((s, e, i) => (i === 0 ? e : s + ',' + e), '');
        VKConnect.send("VKWebAppCallAPIMethod",
            {
                method: "users.get",
                params: {
                    user_ids: user_ids,
                    fields: 'photo_50,city',
                    v: Settings.VK_API_VERSION,
                    access_token: Settings.APP_ACCESS_TOKEN
                },
                request_id: "users.get"
            }
        );
        subscribers['VKWebAppCallAPIMethodResult:users.get'] = callback;
    },
    makePayment: (event, callback) => {
        VKConnect.send("VKWebAppOpenPayForm", {
            app_id: Settings.APP_ID,
            action: "pay-to-group",
            params: {
                amount: 1, //event.salePrice,
                description: 'Оплата билета для ' + event.eventId,
                group_id: Settings.GROUP_ID
            }
        })
        subscribers['VKWebAppOpenPayFormResult'] = callback;
    }
};

VKConnect.subscribe((e) => {
    const callback = e.detail.type === 'VKWebAppCallAPIMethodResult'
        ? subscribers['VKWebAppCallAPIMethodResult:' + e.detail.data.request_id]
        : subscribers[e.detail.type];
    if (callback) {
        callback(e.detail.data);
    }
});
