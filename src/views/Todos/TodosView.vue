<template>
	<div class="main-wrapper">
		<section class="main">
			<main class="container card shadow shadow-lg--hover mt-3" id="todolist">
				<div class="row mb-3">
					<div class="col-6">
						<h3>to do list</h3>
					</div>
					<div class="col-6 text-right">
						<h3>get productive now :)</h3>
					</div>
				</div>

				<div class="row">
					<div class="col-4">
						<router-link to="/todos" :class="{ selected: status === 'all' }"
							><span class="badge badge-primary"
								>Total : {{ this.todos.length || 0 }}</span
							></router-link
						>
					</div>
					<div class="col-4">
						<router-link to="/done" :class="{ selected: status === 'done' }"
							><span class="badge badge-success"
								>Completed : {{ completedTodos.length || 0 }}</span
							></router-link
						>
					</div>
					<div class="col-4">
						<router-link
							to="/pending"
							:class="{ selected: status === 'pending' }"
							><span class="badge badge-warning"
								>Pending : {{ tasksLeft.length || 0 }}</span
							></router-link
						>
					</div>
					<div class="col-md-12 mt-3">
						<div class="form-group">
							<input
								type="text"
								name="newTodo"
								class="add-todo-field form-control"
								placeholder="meal prep..."
								v-on:keydown.enter="addTodo($event)"
								autocomplete="off"
								v-model.trim="newTodoText"
							/>
							<i
								class="fa fa-arrow-right submit-icon"
								@click="addTodo($event)"
								aria-hidden="true"
							></i>
						</div>
					</div>
				</div>

				<b-list-group class="todo-list">
					<b-list-group-item
						v-for="todo in currentTodos"
						:key="todo.id"
						:class="{ completed: todo.complete }"
						class="d-flex justify-content-between align-items-center"
					>
						<div class="todo-info">
							<span class="label todo-text">{{ todo.text }}</span>
						</div>
						<div class="view">
							<input
								type="checkbox"
								class="btn-picto"
								v-model="todo.complete"
							/>
							<button
								class="delete"
								tupe="button"
								aria-label="Delete"
								@click="deleteTask(todo.id)"
							>
								<i aria-hidden="true" class="material-icons">delete</i>
							</button>
						</div>
					</b-list-group-item>
				</b-list-group>
			</main>
		</section>
		<button @click="logout">log out</button>
	</div>
</template>

<script>
import firebase from "firebase/compat/app";

export default {
	name: "TodosView",
	data: function () {
		return {
			todos: [
				{ id: 0, text: "hello", complete: false },
				{ id: 1, text: "this is a random todo", complete: true },
				{ id: 2, text: "no sir", complete: false },
			],
			newTodoText: "",
		};
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
		deleteTask(id) {
			this.todos.splice(id, 1);
		},
		addTodo(e) {
			if (this.newTodo.length) {
				e.preventDefault();
				const newTodo = {
					id: this.todos.length,
					text: this.newTodo.text,
					complete: false,
				};
				this.todos.push({
					newTodo,
				});
				this.newTodoText = "";
			}
		},
	},
	computed: {
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
