import React from 'react';
import { Select, Input, Row, Col } from 'antd';

const { Option } = Select;
const { Search } = Input;


export default function filter({ locationParams, handleSelect, updateLocParams }) {
    return (<>
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

    </>)
}