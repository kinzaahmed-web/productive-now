<template>
	<div class="main-wrapper">
		<section class="main">
			<main class="container card shadow shadow-lg--hover mt-5" id="todolist">
				<div class="row mb-3">
					<h3 class="mt-3 ml-3">get productive now :)</h3>
				</div>

				<div class="row">
					<div class="col-4">
						<router-link to="/todos" :class="{ selected: status === 'all' }">
							<b-button pill variant="outline-info"
								>Total : {{ this.todos.length || 0 }}</b-button
							></router-link
						>
					</div>
					<div class="col-4">
						<router-link to="/done" :class="{ selected: status === 'done' }">
							<b-button pill variant="outline-success"
								>Completed : {{ completedTodos.length || 0 }}</b-button
							></router-link
						>
					</div>
					<div class="col-4">
						<router-link
							to="/pending"
							:class="{ selected: status === 'pending' }"
						>
							<b-button pill variant="outline-warning"
								>Pending : {{ tasksLeft.length || 0 }}</b-button
							></router-link
						>
					</div>

					<div class="col-md-12 mt-3">
						<!-- <input
							class="new-todo"
							autofocus
							autocomplete="off"
							placeholder="What needs to be done?"
							v-model="newTodo"
							@keyup.enter="addTodo"
						/> -->
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
						<!-- <div class="form-group">
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
						</div> -->
					</div>
				</div>
				<b-list-group class="todo-list mb-4">
					<b-list-group-item
						v-for="todo in currentTodos"
						:key="todo.id"
						:class="{ completed: todo.complete }"
						class="d-flex justify-content-between align-items-center"
					>
						<!-- <div class="view">
							<input class="toggle" type="checkbox" v-model="todo.complete" />
							<label>{{ todo.text }}</label>
							<button class="delete" @click="deleteTask(todo.id)"></button>
						</div> -->
						<div class="todo-info">
							<span class="label todo-text">{{ todo.text }}</span>
						</div>
						<div class="view">
							<b-button-group class="mr-1">
								<b-form-checkbox
									size="lg"
									aria-label="complete!"
									v-model="todo.complete"
								>
								</b-form-checkbox>
								<b-button
									variant="outline-primary"
									title="Delete"
									@click="deleteTask(todo.id)"
								>
									<b-icon icon="trash"></b-icon> Delete
								</b-button>
							</b-button-group>
						</div>
					</b-list-group-item>
				</b-list-group>
			</main>
		</section>
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
			newTodo: "",
			editedTodo: null,
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
		addTodo: function () {
			var value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			this.todos.push({ id: this.todos.length, text: value, complete: false });
			this.newTodo = "";
		},
		makeToast(append = false) {
			this.$bvToast.toast(`Good job for completing your task!`, {
				title: "Completed Task!",
				autoHideDelay: 5000,
				appendToast: append,
			});
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
<style scoped>
.new-todos {
	padding: 16px 16px 16px 60px;
	border: none;
	background: rgba(0, 0, 0, 0.003);
	box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.b-form-checkbox.completed label {
	color: #d9d9d9;
	text-decoration: line-through;
}
</style>
