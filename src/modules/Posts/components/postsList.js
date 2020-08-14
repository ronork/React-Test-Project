import React from 'react';
import { List } from 'antd';
import constants from '../../utility/constants';

export default function postsList({ isFetching, redditPosts }) {
    const { appList } = constants.appStyles;
    return (<>
        {isFetching == "NF" || isFetching == "AF" || isFetching == "D" ?
            <List
                dataSource={redditPosts}
                renderItem={(item) => {
                    if (item) {
                        return (
                            <List.Item style={appList} key={item.id}>
                                <List.Item.Meta
                                    description={<span>Posted By:{item.author.username} | Score:{item.score}</span>}
                                    title={<a href={item.url}>{item.title}</a>}
                                />
                            </List.Item>)
                    }
                    return null


                }}
            >
            </List>
            : null}
    </>)
}