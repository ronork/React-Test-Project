import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import constants from '../../utility/constants';
import { useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom";
const { Header, Content } = Layout;
import Filter from './filter';
import PostsList from './postsList';
import genLocationParams from '../helpers/genLocationParams';

export default function listing() {
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        let locParams = genLocationParams();
        toggleFetching("F");
        fetchRes("", "locChange", locParams)
        updateLocParams(locParams);
    }, [location])


    const [redditPosts, updateData] = useState([]);
    const [isFetching, toggleFetching] = useState('F');
    const [locationParams, updateLocParams] = useState(genLocationParams())



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


            if (parsedData.length == 0) {
                toggleFetching("D");
            }

            type == "autofetch" ? updateData([...redditPosts, ...parsedData]) : updateData(parsedData);
        }
        catch (e) {

            if (type == "locChange")
                updateData([])

            window.scrollTo(0, 0);
            toggleFetching('NF');
        }

    }

    const handleScroll = (e) => {
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
        if ((isFetching == "F" || isFetching == "AF") && redditPosts.length > 0) {
            toggleFetching("NF");
        }
    }, [redditPosts])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }, [isFetching, redditPosts])

    const { pageSpin, autoFetchSpin } = constants.appStyles

    return (<>
        <Layout className="layout" style={{ background: "white" }} >
            <Header style={{ background: constants.colors.blue }}>
                <h2 style={{ textAlign: "center" }}>Reddit Posts</h2>
            </Header>

            <Content style={{ padding: '0 10px' }}>
                <Filter locationParams={locationParams} handleSelect={handleSelect} updateLocParams={updateLocParams} />

                <PostsList isFetching={isFetching} redditPosts={redditPosts} />
                {isFetching == "F" || isFetching == "AF" ? <Spin style={isFetching == "F" ? pageSpin : autoFetchSpin} /> : null}

            </Content>
        </Layout>

    </>)
}