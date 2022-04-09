<template>
	<div class="main-wrapper">
		<section class="main">
			<main class="container card shadow shadow-lg--hover m-3" id="todolist">
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
						<b-input-group size="sm" class="mb-2">
							<b-input-group-prepend is-text>
								<b-icon icon="search"></b-icon>
							</b-input-group-prepend>
							<b-form-input
								type="search"
								class="new-todo"
								autofocus
								autocomplete="off"
								placeholder="what needs to get done?"
								v-model="newTodo"
								@keyup.enter="addTodo"
							></b-form-input>
							<b-form-select
								v-bind="inputAttrs"
								v-on="inputHandlers"
								:disabled="disabled || tags.length === 0"
								:options="tags"
							>
								<template #first>
									<!-- This is required to prevent bugs with Safari -->
									<option disabled value="">Choose a tag...</option>
								</template>
							</b-form-select>
							<b-button @click="addTodo"> add task </b-button>
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
							@click="deleteTask(todo.id)"
						>
							<b-icon icon="trash"></b-icon> Delete
						</b-button>
					</b-list-group-item>
				</b-list-group>
			</main>

			<main class="container card shadow shadow-lg--hover m-3" id="categories">
				<div class="row mb-3">
					<h3 class="mt-3 ml-3">category list</h3>
				</div>

				<div class="row">
					<div class="col-md-12 mt-3">
						<b-form-tags v-model="tags" no-outer-focus class="mb-2">
							<template
								v-slot="{ tags, inputAttrs, inputHandlers, addTag, removeTag }"
							>
								<b-input-group class="mb-2">
									<b-form-input
										v-bind="inputAttrs"
										v-on="inputHandlers"
										placeholder="New tag - Press enter to add"
										class="form-control"
									></b-form-input>
									<b-input-group-append>
										<b-button @click="addTag()" variant="primary">Add</b-button>
									</b-input-group-append>
								</b-input-group>
								<div class="d-inline-block" style="font-size: 1.5rem">
									<b-form-tag
										v-for="tag in tags"
										@remove="removeTag(tag)"
										:key="tag"
										:title="tag"
										variant="info"
										class="mr-1"
										><router-link
											:to="{
												path: `todos/${tag}`,
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
			tags: ["apple", "orange", "banana"],
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
		addTag(tag) {
			this.tags.push(tag);
		},
		removeTag(tag) {
			const indx = this.tags.indexOf(tag);
			this.tags.splice(indx, 1);
		},
		removeTagFromTask(todo) {
			console.log(todo);
			const indx = this.tags.indexOf(todo);
			this.tags[indx].tag = null;
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

.complete {
	color: #d9d9d9;
	text-decoration: line-through;
}
</style>
