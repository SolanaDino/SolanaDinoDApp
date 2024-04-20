import React, { useEffect } from "react";
import { Col, Row } from "antd";

import { LoveshackView } from "..";

export const HomeView = () => {
  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}>
        <LoveshackView></LoveshackView>
      </Col>
      <Col span={12}></Col>
      <Col span={24}>
        <div className="builton" />
      </Col>
    </Row>
  );
};
