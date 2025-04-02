const { configureStore } = require("@reduxjs/toolkit");
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import projectReducer from "./projectSlice"
import dashboardReducer from "./dashboardSlice"
import notificationReducer from "./notificationSlice"
import smmangementReducer from "./smmangementSlice"
import campaignReducer from "./campaignSlice"
import seoReducer from "./seoSlice"
import collabrationReducer from "./collabrationSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        project: projectReducer,
        dashboard: dashboardReducer,
        notification: notificationReducer,
        post:smmangementReducer,
        campaign:campaignReducer,
        seo:seoReducer,
        collabration:collabrationReducer
    }
})