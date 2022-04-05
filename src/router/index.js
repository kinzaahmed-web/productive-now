import Vue from "vue";
import VueRouter from "vue-router";
import TodosView from "../views/Todos/TodosView.vue";
import TodoDetails from "../views/Todos/TodoDetails.vue";
import LoginView from "../views/LoginView.vue";
import NotFound from "../views/NotFound.vue";
import SignUpView from "../views/SignUpView.vue";
import firebase from "firebase/compat/app";

Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
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
			name: "Todos",
			component: TodosView,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/:status",
			name: "Todos",
			component: TodosView,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/todos/:id",
			name: "TodoDetails",
			component: TodoDetails,
			props: true,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/:catchAll(.*)",
			name: "NotFound",
			component: NotFound,
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
