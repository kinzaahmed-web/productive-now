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
										v-model="newTodo"
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
										v-model="newTaskTag"
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
									@click="deleteTask(todo.id)"
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
								<b-form-tags v-model="tags" no-outer-focus class="mb-2">
									<template
										v-slot="{
											tags,
											inputAttrs,
											inputHandlers,
											addTag,
											removeTag,
										}"
									>
										<b-input-group class="mb-2">
											<b-form-input
												v-bind="inputAttrs"
												v-on="inputHandlers"
												placeholder="budgeting.."
												class="form-control"
											></b-form-input>
											<b-input-group-append>
												<b-button @click="addTag()" variant="primary"
													>add</b-button
												>
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
			newTaskTag: "",
			newTodo: "",
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
			var tagValue = this.newTaskTag && this.newTaskTag.trim();
			if (!tagValue) {
				return;
			}
			this.todos.push({
				id: this.todos.length,
				text: value,
				complete: false,
				tag: tagValue,
			});
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

div span span a {
	color: white;
}
</style>
