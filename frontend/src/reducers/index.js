import { combineReducers } from "redux";
import { request } from "./request";
import { service } from "./service";
import { user } from "./user";

export default combineReducers({ user, service, request });