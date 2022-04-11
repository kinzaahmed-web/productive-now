<template>
	<div class="main-wrapper">
		<section class="main">
			<b-row>
				<b-col sm="8">
					<main
						class="container card shadow shadow-lg--hover m-3"
						id="todolist"
					>
						<div class="row mb-3">
							<h3 class="mt-3 ml-3">get productive now :)</h3>
						</div>

						<div class="row">
							<div class="col-4">
								<router-link
									to="/todos"
									:class="{ selected: status === 'all' }"
								>
									<b-button pill variant="outline-info"
										>total : {{ this.todos.length || 0 }}</b-button
									></router-link
								>
							</div>
							<div class="col-4">
								<router-link
									to="/done"
									:class="{ selected: status === 'done' }"
								>
									<b-button pill variant="outline-success"
										>completed : {{ completedTodos.length || 0 }}</b-button
									></router-link
								>
							</div>
							<div class="col-4">
								<router-link
									to="/pending"
									:class="{ selected: status === 'pending' }"
								>
									<b-button pill variant="outline-warning"
										>pending : {{ tasksLeft.length || 0 }}</b-button
									></router-link
								>
							</div>

							<div class="col-md-12 mt-3">
								<b-form @submit.stop.prevent>
									<h3>add a new task</h3>
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
									<b-form-select
										v-bind="inputAttrs"
										v-on="inputHandlers"
										v-model="newTodo.tag"
										:options="tags"
										required
										class="mt-4"
									>
										<template #first>
											<!-- This is required to prevent bugs with Safari -->
											<option disabled value="">select a tag...</option>
										</template>
									</b-form-select>
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
									<b-icon icon="trash"></b-icon> delete
								</b-button>
							</b-list-group-item>
						</b-list-group>
					</main>
				</b-col>
				<b-col sm="3.5">
					<main
						class="container card shadow shadow-lg--hover m-3 mr-2"
						id="categories"
					>
						<div class="row mb-3">
							<h3 class="mt-3 ml-3">category list</h3>
						</div>

						<div class="row">
							<div class="col-md-12 mt-3">
								<b-form @submit.stop.prevent>
									<b-form-input
										v-model="newTag"
										:state="tagValidation"
										class="mb-2 mr-sm-2 mb-sm-0 mt-2"
										placeholder="finances.."
										required
									></b-form-input>
									<b-form-valid-feedback :state="tagValidation">
										looks good!
									</b-form-valid-feedback>
									<b-button
										@click="addTag"
										type="submit"
										variant="outline-primary"
										pill
										class="m-4"
									>
										add tag
									</b-button>
								</b-form>
								<b-form-tags v-model="tags" no-outer-focus class="mb-2">
									<template>
										<div class="d-inline-block" style="font-size: 1.5rem">
											<b-form-tag
												v-for="tag in tags"
												@remove="removeTag(tag)"
												:key="tag.id"
												variant="info"
												class="mr-1"
												><router-link
													:to="{
														path: `/todos/${tag}`,
														params: {
															tag: tag,
														},
													}"
													>{{ tag }}</router-link
												></b-form-tag
											>
										</div>
									</template>
								</b-form-tags>
							</div>
						</div>
					</main>
				</b-col>
			</b-row>
		</section>
	</div>
</template>

<script>
import firebase from "firebase/app";
import _ from "lodash";
import { auth, db } from "@/main";

export default {
	name: "TodosView",
	data: function () {
		return {
			selected: "",
			errors: [],
			tags: [],
			todos: [],
			newTodo: {
				text: "",
				tag: "",
			},
			newTag: "",
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
				.where("complete", "==", false)
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
		getTags() {
			let self = this;
			self.tags = [];
			db.collection("category")
				.where("authorEmail", "==", auth.currentUser.email)
				.get()
				.then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						self.tags.push(doc.data().name);
					});
				});
		},
		logout() {
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.$router.replace("login");
				});
		},
		deleteTask(todo) {
			db.collection("todo").doc(todo.id).delete().then(this.handler);
		},
		addTodo() {
			const createdAt = new Date();
			db.collection("todo")
				.add({
					text: this.newTodo.text,
					tag: this.newTodo.tag,
					complete: false,
					authorEmail: this.user.email,
					createdAt: createdAt,
				})
				.then(this.handler);
		},
		addTag() {
			const createdAt = new Date();
			db.collection("category")
				.add({
					name: this.newTag,
					authorEmail: this.user.email,
					createdAt: createdAt,
				})
				.then(this.handler);
		},
		removeTag(tag) {
			db.collection("category")
				.where("name", "==", tag)
				.get()
				.then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						db.collection("category").doc(doc.id).delete();
					});
				});
			// this.todos = [];
			db.collection("todo")
				.where("tag", "==", tag)
				.get()
				.then(function (querySnapshot) {
					querySnapshot.forEach(function (doc) {
						db.collection("todo").doc(doc.id).update({ tag: null });
					});
				})
				.then(this.handler);

			alert("Delete success");
		},
		removeTagFromTask(todo) {
			db.collection("todo")
				.doc(todo.id)
				.update({ tag: null })
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
		tagValidation() {
			return this.newTag.length > 3 && this.newTag.length < 10;
		},
		orderedTodos: function () {
			return _.orderBy(this.todos, "date", "desc");
		},
		orderedCates: function () {
			return _.orderBy(this.category, "date", "desc");
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

div span span a {
	color: white;
}
</style>
