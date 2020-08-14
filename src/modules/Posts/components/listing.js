import React, { useEffect, useState } from 'react';
import { List, Avatar, Button, Skeleton, Spin as Spinner } from 'antd';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
// or 'antd/dist/antd.less'

const { Header, Content, Footer } = Layout;
import constants from '../../utility/constants';
import InfiniteScroll from 'react-infinite-scroller';





export default function listing() {

    const [redditPosts, updateData] = useState([])
    const [isFetching, toggleFetching] = useState('NF')

    async function fetchRes(after = "") {
        console.log(after);
        let query = `{
            graphQLHub
            reddit {
              subreddit(name: "posts") {
                newListings(limit: 10 ${after ? ',after: "' + after + '"' : ''}) {
                 fullnameId
                  title
                  author {
                    username
                  }
                  score
                  url
                }
              }
            }
          }
          `;
        console.log(query);

        try {
            const response = await fetch(constants.apiUrl + query)
            const data = await response.json();
            let parsedData = []
            data.data.reddit.subreddit.newListings.map((item) => { if (item && item.fullnameId) parsedData.push(item) })
            console.log(parsedData);
            updateData([...redditPosts, ...parsedData]);
        }
        catch (e) {
            console.log(e);
            toggleFetching('F')
        }

    }

    function handleScroll(e) {
        if ((window.innerHeight + window.scrollY + 100) >= document.body.scrollHeight && (isFetching == 'NF' || isFetching == 'D')) {
            toggleFetching('F');
            fetchRes(redditPosts[redditPosts.length - 1].fullnameId);
            console.log("END REACHED");
        }
    }

    useEffect(() => {

        if (isFetching == "F")
            toggleFetching("NF");
    }, [redditPosts])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }, [isFetching, redditPosts])

    useEffect(() => {
        fetchRes();
    }, [])


    return (<>
        <Layout className="layout" style={{ background: "white" }} >
            <Header style={{ background: constants.colors.blue }}>
                <h2 style={{ textAlign: "center" }}>Reddit Posts</h2>
            </Header>
            <Content style={{ padding: '0 10px' }}>

                {redditPosts.length != 0 ?


                    <List
                        dataSource={redditPosts}

                        renderItem={(item) => {
                            if (item) {
                                return (
                                    <List.Item style={{
                                        padding: "20px",
                                        background: "rgb(255 245 0 / 18%)",
                                        margin: "20px 2px 5px",
                                        borderRadius: "10px",
                                        background: "rgb(24 144 255 / 10%)",
                                        boxShadow: "0px 8px 26px -15px #aeaeae"
                                    }} key={item.id}>
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
                    :
                    <Spinner style={{
                        position: "fixed",
                        right: "0",
                        left: "0",
                        bottom: "0",
                        width: "30px",
                        height: "30px",
                        top: "0",
                        margin: "auto"
                    }} />}


                {isFetching == "F" ?
                    <Spinner style={{
                        position: "absolute",
                        right: "0",
                        left: "0",
                        width: "30px",
                        height: "30px",
                        margin: "auto"
                    }} />
                    : null}

            </Content>

            {/* <Footer style={{ textAlign: 'center', background: "#ff00002e" }}>React-GraphQL Test Project</Footer> */}
        </Layout>

    </>)
}