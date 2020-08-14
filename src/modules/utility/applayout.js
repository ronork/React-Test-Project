import { Layout } from 'antd';
import React from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const { Header, Content, Footer } = Layout;
import colors from './constants';

export default function AppLayout({ title, AppContent }) {

    return (<>
        <Layout className="layout" >
            <Header style={{ background: colors.grey }}>
                <h2>{title}</h2>
            </Header>
            {AppContent ? <Content style={{ padding: '0 50px' }}>
                <AppContent />
            </Content> : null}

            {/* <Footer style={{ textAlign: 'center', background: "#ff00002e" }}>React-GraphQL Test Project</Footer> */}
        </Layout>
    </>)
}