import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import firebase from "firebase/compat/app";

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
		{
			path: "*",
			redirect: "/login",
		},
		{
			path: "/",
			redirect: "/login",
		},
		{
			path: "/login",
			name: "Login",
			component: LoginView,
		},
		{
			path: "/sign-up",
			name: "SignUp",
			component: SignUpView,
		},
		{
			path: "/todos",
			name: "Home",
			component: HomeView,
			meta: {
				requiresAuth: true,
			},
		},
	],
});

router.beforeEach((to, _, next) => {
	const currentUser = firebase.auth().currentUser;
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

	if (requiresAuth && !currentUser) next("login");
	else if (!requiresAuth && currentUser) next("todos");
	else next();
});

export default router;
