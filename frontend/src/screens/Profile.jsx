import classnames from "classnames";
import React, { useState } from "react";
import { Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import EditProfile from "../components/EditProfile";
import MyServices from "../components/MyServices";
import PostService from "../components/PostService";
import Scheduler from "../components/Scheduler";

const Profile = ({ match, history }) => {
  let initialTab = null;
  if (history.location.pathname.startsWith("/profile/profile")) {
    initialTab = "1";
  } else if (history.location.pathname.startsWith("/profile/myservices")) {
    initialTab = "2";
  } else if (history.location.pathname.startsWith("/profile/postservice")) {
    initialTab = "3";
  } else if (history.location.pathname.startsWith("/profile/scheduler")) {
    initialTab = "4";
  }

  const [activeTab, setActiveTab] = useState(initialTab);

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
                  history.push("/profile/profile");
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
                  history.push("/profile/myservices/page/1");
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
                  history.push("/profile/postservice");
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
                  history.push("/profile/scheduler");
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
              <MyServices match={match}></MyServices>
            </TabPane>
            <TabPane tabId="3">
              <PostService history={history}></PostService>
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
