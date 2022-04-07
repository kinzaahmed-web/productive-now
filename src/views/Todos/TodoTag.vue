<template>
	<div class="main-wrapper">
		<section class="main">
			<router-link to="/todos">
				<b-button> Go back to all todos! </b-button>
			</router-link>
			<main class="container card shadow shadow-lg--hover mt-5" id="todolist">
				<div class="row mb-3">
					<h3 class="mt-3 ml-3">{{ tag }} : get productive now :)</h3>
				</div>

				<div class="row">
					<div class="col-4">
						<router-link
							:to="{
								name: 'TodoTag',
								params: {
									filter: 'todos',
									tag: tag,
									todos: todos,
								},
							}"
						>
							<b-button pill variant="outline-info"
								>Total : {{ this.todos.length || 0 }}</b-button
							>
						</router-link>
					</div>
					<div class="col-4">
						<router-link
							:to="{
								name: 'TodoTag',
								params: {
									filter: 'done',
									tag: tag,
									todos: filteredTodos('done'),
								},
							}"
						>
							<b-button pill variant="outline-success"
								>Completed : {{ completedTodos.length || 0 }}</b-button
							>
						</router-link>
					</div>
					<div class="col-4">
						<router-link
							:to="{
								name: 'TodoTag',
								params: {
									filter: 'pending',
									tag: tag,
									todos: filteredTodos('pending'),
								},
							}"
						>
							<b-button pill variant="outline-warning"
								>Pending : {{ tasksLeft.length || 0 }}</b-button
							>
						</router-link>
					</div>

					<div class="col-md-12 mt-3">
						<b-input-group size="sm" class="mb-2">
							<b-input-group-prepend is-text>
								<b-icon icon="search"></b-icon>
							</b-input-group-prepend>
							<b-form-input
								type="search"
								class="new-todo"
								autofocus
								autocomplete="off"
								placeholder="What needs to be done?"
								v-model="newTodo"
								@keyup.enter="addTodo"
							></b-form-input>
						</b-input-group>
					</div>
				</div>
				<b-list-group flush class="todo-list mb-4">
					<b-list-group-item
						v-for="todo in currentTodos"
						:key="todo.id"
						:class="{ completed: todo.complete }"
						class="d-flex justify-content-between align-items-center"
					>
						<b-form-checkbox
							size="lg"
							aria-label="complete!"
							v-model="todo.complete"
						>
						</b-form-checkbox>

						<div class="todo-info">
							<router-link
								:to="{
									name: 'TodoDetails',
									params: { id: todo.id, todo: todo },
								}"
							>
								<span v-if="todo.complete" class="complete">{{
									todo.text
								}}</span>
								<span v-else>{{ todo.text }}</span>
							</router-link>
						</div>
						<b-button pill variant="outline-danger">{{ todo.tag }}</b-button>
						<b-button
							variant="outline-primary"
							title="Delete"
							@click="deleteTask(todo.id)"
						>
							<b-icon icon="trash"></b-icon> Delete
						</b-button>
					</b-list-group-item>
				</b-list-group>
			</main>
		</section>
	</div>
</template>

<script>
import firebase from "firebase/compat/app";
export default {
	name: "TodoTag",
	props: {
		filter: String,
		tag: String,
		todos: Array,
	},
	methods: {
		logout() {
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.$router.replace("login");
				});
		},
		filteredTodos(filter) {
			if (filter === "done") {
				return this.completedTodos;
			} else if (filter === "pending") {
				return this.tasksLeft;
			} else {
				return this.todos;
			}
		},
	},
	computed: {
		// deleteTask(id) {
		// 	this.todos.splice(id, 1);
		// },
		// addTodo() {
		// 	var value = this.newTodo && this.newTodo.trim();
		// 	if (!value) {
		// 		return;
		// 	}
		// 	this.todos.push({ id: this.todos.length, text: value, complete: false });
		// 	this.newTodo = "";
		// },
		tasksLeft() {
			return this.todos.filter((t) => !t.complete);
		},
		completedTodos() {
			return this.todos.filter((t) => t.complete);
		},
		status() {
			return this.$route.params.status;
		},
		currentTodos() {
			if (this.status === "done") {
				return this.completedTodos;
			} else if (this.status === "pending") {
				return this.tasksLeft;
			} else {
				return this.todos;
			}
		},
	},
};
</script>

<style scoped>
.new-todos {
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.003);
	box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.complete {
	color: #d9d9d9;
	text-decoration: line-through;
}
</style>
