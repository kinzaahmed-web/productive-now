import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

let app = "";
const firebaseConfig = {
	apiKey: "AIzaSyDxBmEQBeyFJ_IrMN_pzA3TA0LBroVMrB8",
	authDomain: "productive-now.firebaseapp.com",
	projectId: "productive-now",
	storageBucket: "productive-now.appspot.com",
	messagingSenderId: "284805137229",
	appId: "1:284805137229:web:d8ae6c92550a09049b6d04",
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(() => {
	if (!app) {
		/* eslint-disable no-new */
		app = new Vue({
			router,
			render: (h) => h(App),
		}).$mount("#app");
	}
});

const db = firebase.firestore();

const settings = { timestampsInSnapshots: true };
db.settings(settings);

const auth = firebase.auth();

export { db, auth };
