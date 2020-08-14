import React, { useEffect, useState } from 'react';
import { List, Select, Input, Avatar, Button, Skeleton, Spin as Spinner, Row, Col } from 'antd';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
const { Header, Content, Footer } = Layout;
import constants from '../../utility/constants';
import { Link, useLocation } from 'react-router-dom'
const { Option } = Select
const { Search } = Input;
import { useHistory } from "react-router-dom";


export default function listing() {
    const history = useHistory();
    const location = useLocation();

    const genLocationParams = () => {
        let params = (new URL(document.location)).searchParams

        return {
            'cat': params.get('cat'),
            'time': params.get('time'),
            'search': params.get('search')
        };
    }
    // let history = useHistory();
    useEffect(() => {
        let locParams = genLocationParams();
        toggleFetching("F");
        fetchRes("", "locChange", locParams)
        updateLocParams(locParams);
    }, [location])


    const [redditPosts, updateData] = useState([]);
    const [isFetching, toggleFetching] = useState('NF');

    const [locationParams, updateLocParams] = useState(genLocationParams())

    const [selectedCat, toggleCat] = useState('new')

    async function fetchRes(after = "", type = "autofetch", locParams = "") {
        let { search, time, cat } = type == "autofetch" ? locationParams : locParams
        let query = `{
            graphQLHub
            reddit {
              subreddit(name: "${search}") {
                ${cat}Listings(limit: 10 ${after ? ',after: "' + after + '"' : ''} ${time ? ',timeInterval:' + time : ''}) {
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

        try {
            const response = await fetch(constants.apiUrl + query)
            const data = await response.json();
            let parsedData = []
            data.data.reddit.subreddit[`${cat}Listings`].map((item) => { if (item && item.fullnameId) parsedData.push(item) })

            type == "autofetch" ? updateData([...redditPosts, ...parsedData]) : updateData(parsedData);
        }
        catch (e) {

            if (type == "locChange")
                updateData([])

            toggleFetching('NF')
        }

    }
    function handleScroll(e) {
        if ((window.innerHeight + window.scrollY + 100) >= document.body.scrollHeight && isFetching == 'NF') {
            toggleFetching('AF');
            fetchRes(redditPosts[redditPosts.length - 1].fullnameId);
        }
    }

    const handleSelect = (e, type = "cat") => {
        let { search, time, cat } = genLocationParams();

        if (type == "cat" && !(e == "top" || e == "controversial")) {
            time = '';
        }


        history.push(`/posts?cat=${type == "cat" ? e : cat}&search=${type == "search" ? e : search}${type == "time" ? '&time=' + e : time ? '&time=' + time : ''}`)
    }

    useEffect(() => {

        if (isFetching == "F" || isFetching == "AF")
            toggleFetching("NF");
    }, [redditPosts])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }, [isFetching, redditPosts])


    return (<>
        <Layout className="layout" style={{ background: "white" }} >
            <Header style={{ background: constants.colors.blue }}>
                <h2 style={{ textAlign: "center" }}>Reddit Posts</h2>
            </Header>

            <Content style={{ padding: '0 10px' }}>
                <Row style={{ margin: "10px" }}>
                    <Col span={12} style={{ padding: "5px" }}>
                        <Search onChange={(e) => { updateLocParams({ ...locationParams, ...{ search: e.target.value } }) }} value={locationParams.search} placeholder="Search Something" onSearch={value => handleSelect(value, "search")} enterButton />
                    </Col>
                    <Col span={12} style={{ textAlign: 'center', padding: "5px" }}>
                        <span style={{ marginRight: "5px" }}> Sort:</span>
                        <Select value={locationParams.cat} style={{ width: 120, marginRight: "5px" }} onSelect={(e) => { handleSelect(e, "cat") }}>
                            <Option value="hot">Hot</Option>
                            <Option value="top">Top</Option>
                            <Option value="rising">Rising</Option>
                            <Option value="controversial">Controversial</Option>
                            <Option value="new">New</Option>
                        </Select>
                        <Select disabled={!(locationParams.cat == "controversial" || locationParams.cat == "top")} onSelect={(e) => { handleSelect(e, "time") }} value={locationParams.time ? locationParams.time : "Time"} style={{ width: 120 }}>
                            <Option value="hour">An Hour ago</Option>
                            <Option value="day">A Day ago</Option>
                            <Option value="week">A Week Ago</Option>
                            <Option value="month">A Month Ago</Option>
                        </Select>
                    </Col>

                </Row>


                {isFetching == "NF" || isFetching == "AF" ?
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
                    : null}

                {isFetching == "F" ? <Spinner style={{
                    position: "fixed",
                    right: "0",
                    left: "0",
                    bottom: "0",
                    width: "30px",
                    height: "30px",
                    top: "0",
                    margin: "auto"
                }} /> : null}


                {isFetching == "AF" ?
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