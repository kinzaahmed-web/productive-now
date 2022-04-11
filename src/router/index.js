import Vue from "vue";
import VueRouter from "vue-router";
import TodosView from "../views/Todos/TodosView.vue";
import TodoDetails from "../views/Todos/TodoDetails.vue";
import TodoTag from "../views/Todos/TodoTag.vue";
import LoginView from "../views/LoginView.vue";
import NotFound from "../views/NotFound.vue";
import firebase from "firebase/app";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	routes: [
		{
			path: "/",
			name: "Login",
			component: LoginView,
		},
		{
			path: "/404",
			name: "NotFound",
			component: NotFound,
			meta: {
				requiresAuth: true,
			},
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
			path: "/todo/:id",
			name: "TodoDetails",
			component: TodoDetails,
			props: true,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "/:status/:tag",
			name: "TodoTag",
			component: TodoTag,
			props: true,
			meta: {
				requiresAuth: true,
			},
		},
		{
			path: "*",
			redirect: "/404",
		},
	],
});

router.beforeEach((to, _, next) => {
	const currentUser = firebase.auth().currentUser;
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

	if (requiresAuth && !currentUser) next("/");
	else if (!requiresAuth && currentUser) next("/todos");
	else next();
});

export default router;
