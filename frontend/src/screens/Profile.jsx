import classnames from "classnames";
import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import EditProfile from "../components/EditProfile";
import MyServices from "../components/MyServices";
import PostService from "../components/PostService";
import Scheduler from "../components/Scheduler";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  toggle("1");
                }}
              >
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggle("2");
                }}
              >
                Services
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={() => {
                  toggle("3");
                }}
              >
                Post Service
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={() => {
                  toggle("4");
                }}
              >
                Scheduler
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <EditProfile></EditProfile>
            </TabPane>
            <TabPane tabId="2">
              <MyServices></MyServices>
            </TabPane>
            <TabPane tabId="3">
              <PostService></PostService>
            </TabPane>
            <TabPane tabId="4">
              <Scheduler></Scheduler>
            </TabPane>
          </TabContent>
        </div>
      </Row>
    </Container>
  );
};

export default Profile;
