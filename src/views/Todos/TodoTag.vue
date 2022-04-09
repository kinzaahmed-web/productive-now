<template>
	<div class="main-wrapper">
		<section class="main">
			<router-link to="/todos">
				<b-button> Go back to all todos! </b-button>
			</router-link>
			<main class="container card shadow shadow-lg--hover m-3" id="todolist">
				<div class="row mb-3">
					<h3 class="mt-3 ml-3">{{ tag }} task(s)</h3>
				</div>

				<div class="row">
					<div class="col-4">
						<router-link
							:to="`/todos/${tag}`"
							:class="{ selected: status === 'all' }"
						>
							<b-button pill variant="outline-info"
								>Total : {{ this.tagTodos.length || 0 }}</b-button
							></router-link
						>
					</div>
					<div class="col-4">
						<router-link
							:to="`/done/${tag}`"
							:class="{ selected: status === 'done' }"
						>
							<b-button pill variant="outline-success"
								>Completed : {{ completedTodos.length || 0 }}</b-button
							></router-link
						>
					</div>
					<div class="col-4">
						<router-link
							:to="`/pending/${tag}`"
							:class="{ selected: status === 'pending' }"
						>
							<b-button pill variant="outline-warning"
								>Pending : {{ tasksLeft.length || 0 }}</b-button
							></router-link
						>
					</div>

					<div class="col-md-12 mt-3">
						<b-form @submit.stop.prevent>
							<h3>add a new task in {{ tag }}</h3>
							<b-form-input
								v-model="newTodo"
								:state="taskValidation"
								class="mb-2 mr-sm-2 mb-sm-0 mt-2"
								placeholder="do the laundry.."
								required
							></b-form-input>
							<b-form-valid-feedback :state="taskValidation">
								looks good!
							</b-form-valid-feedback>
							<b-button
								@click="addTodo"
								type="submit"
								variant="outline-primary"
								pill
								class="m-4"
							>
								add task
							</b-button>
						</b-form>
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
						<b-form-tag
							v-if="todo.tag"
							:title="tag"
							:disabled="true"
							variant="info"
							>{{ todo.tag }}</b-form-tag
						>
						<b-button
							variant="outline-primary"
							title="Delete"
							pill
							@click="deleteTask(todo.id)"
						>
							<b-icon icon="trash"></b-icon> delete
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
		tag: String,
	},
	data: function () {
		return {
			todos: [
				{ id: 0, text: "hello", complete: false, tag: null },
				{
					id: 1,
					text: "this is a random todo",
					complete: true,
					tag: null,
				},
				{ id: 2, text: "homework 5", complete: false, tag: "math" },
				{ id: 3, text: "homework 1", complete: false, tag: "apple" },
			],
			newTodo: "",
			tagTodos: "",
		};
	},
	mounted() {
		this.tagTodos = this.todos.filter((t) => t.tag === this.tag);
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
			this.tagTodos.splice(id, 1);
		},
		addTodo: function () {
			var value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			var tagValue = this.tag && this.tag.trim();
			if (!tagValue) {
				return;
			}
			this.todos.push({
				id: this.tagTodos.length,
				text: value,
				complete: false,
				tag: tagValue,
			});
			this.newTodo = "";
		},
	},
	computed: {
		tasksLeft() {
			return this.tagTodos.filter((t) => !t.complete);
		},
		completedTodos() {
			return this.tagTodos.filter((t) => t.complete);
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
				return this.tagTodos;
			}
		},
		taskValidation() {
			return this.newTodo.length > 3 && this.newTodo.length < 21;
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
