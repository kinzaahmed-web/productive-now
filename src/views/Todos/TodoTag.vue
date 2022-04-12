<template>
	<div class="main-wrapper">
		<section class="main">
			<router-link to="/todos">
				<b-button> Go back to all todos! </b-button>
			</router-link>
			<b-container class="mt-3 card shadow shadow-lg--hover">
				<b-row
					><h3 class="mt-3 ml-3">{{ tag }} task(s)</h3></b-row
				>
				<b-row>
					<b-col
						><router-link
							:to="`/todos/${tag}`"
							:class="{ selected: status === 'all' }"
						>
							<b-button pill variant="outline-info"
								>Total : {{ this.todos.length || 0 }}</b-button
							></router-link
						></b-col
					>
					<b-col
						><router-link
							:to="`/done/${tag}`"
							:class="{ selected: status === 'done' }"
						>
							<b-button pill variant="outline-success"
								>Completed : {{ completedTodos.length || 0 }}</b-button
							></router-link
						></b-col
					>
					<b-col
						><router-link
							:to="`/pending/${tag}`"
							:class="{ selected: status === 'pending' }"
						>
							<b-button pill variant="outline-warning"
								>Pending : {{ tasksLeft.length || 0 }}</b-button
							></router-link
						></b-col
					>

					<div class="col-md-12 mt-3">
						<b-form @submit.stop.prevent>
							<h3>add a new task in {{ tag }}</h3>
							<b-form-input
								v-model="newTodo.text"
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
				</b-row>
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
							@input="completedTask(todo)"
						>
						</b-form-checkbox>

						<div class="todo-info">
							<router-link
								:to="{
									name: 'TodoDetails',
									params: { id: todo.id },
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
							@remove="removeTagFromTask(todo)"
							:title="tag"
							:disabled="disabled"
							variant="info"
							>{{ todo.tag }}</b-form-tag
						>
						<b-button
							variant="outline-primary"
							title="Delete"
							pill
							@click="deleteTask(todo)"
						>
							<b-icon-trash-fill></b-icon-trash-fill>
						</b-button>
					</b-list-group-item>
				</b-list-group>
			</b-container>
		</section>
	</div>
</template>

<script>
import { auth, db } from "@/main";
import { BIconTrashFill } from "bootstrap-vue";

export default {
	name: "TodoTag",
	props: {
		tag: String,
	},
	components: {
		BIconTrashFill,
	},
	data: function () {
		return {
			selected: "",
			todos: [],
			newTodo: {
				text: "",
				tag: "",
			},
			user: auth.currentUser,
		};
	},
	created() {
		this.handler();
	},
	methods: {
		getTodos() {
			let self = this;
			self.todos = [];
			db.collection("todo")
				.where("authorEmail", "==", auth.currentUser.email)
				.where("tag", "==", this.tag)
				.get()
				.then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						self.todos.push({
							id: doc.id,
							text: doc.data().text,
							complete: doc.data().complete,
							date: doc.data().createdAt,
							tag: doc.data().tag,
							authorEmail: doc.data().authorEmail,
						});
					});
				});
		},
		deleteTask(todo) {
			db.collection("todo").doc(todo.id).delete().then(this.handler);
		},
		addTodo() {
			const createdAt = new Date();
			const tagValue = this.tag && this.tag.trim();
			db.collection("todo")
				.add({
					text: this.newTodo.text,
					tag: tagValue,
					complete: false,
					authorEmail: this.user.email,
					createdAt: createdAt,
				})
				.then(this.handler);
		},
		removeTagFromTask(todo) {
			db.collection("todo")
				.doc(todo.id)
				.update({ tag: null })
				.then(this.handler);
		},
		completedTask(todo) {
			db.collection("todo")
				.doc(todo.id)
				.update({ complete: todo.complete })
				.then(this.handler);
		},
		handler() {
			this.getTodos();
			this.getTags();
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
		taskValidation() {
			return this.newTodo.text.length > 3 && this.newTodo.text.length < 21;
		},
	},
};
</script>

<style scoped>
.complete {
	color: #d9d9d9;
	text-decoration: line-through;
}
</style>
