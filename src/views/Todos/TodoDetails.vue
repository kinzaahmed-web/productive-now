<template>
	<div>
		<h1>Todo Details Page</h1>
		<main class="container card shadow shadow-lg--hover m-3" id="todolist">
			<h3 class="m-3">current todo</h3>

			<b-list-group-item
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
					<span v-if="todo.complete" class="complete">{{ todo.text }}</span>
					<span v-else>{{ todo.text }}</span>
				</div>
				<b-form-tag
					v-if="todo.tag"
					@remove="removeTagFromTask(todo)"
					:title="tag"
					:disabled="disabled"
					variant="info"
					>{{ todo.tag }}</b-form-tag
				>
			</b-list-group-item>

			<div class="row">
				<div class="col-md-12 mt-3">
					<b-form @submit.stop.prevent>
						<h3>edit task</h3>
						<b-form-input
							v-model="updatedTodo"
							:state="taskValidation"
							class="mb-2 mr-sm-2 mb-sm-0 mt-2"
							placeholder="do the laundry..."
							required
						></b-form-input>
						<b-form-valid-feedback :state="taskValidation">
							looks good!
						</b-form-valid-feedback>
						<b-form-select
							v-bind="inputAttrs"
							v-on="inputHandlers"
							v-model="updatedTaskTag"
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
							@click="updateTodo"
							type="submit"
							variant="outline-primary"
							pill
							class="m-4"
						>
							update task
						</b-button>
					</b-form>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
export default {
	name: "TodoDetails",
	props: ["id"],
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
			updatedTaskTag: "",
			updatedTodo: "",
			todo: "",
		};
	},
	mounted() {
		this.todo = this.todos[this.id];
	},
	updateTodo() {
		var value = this.updatedTodo && this.updatedTodo.trim();
		if (!value) {
			return;
		}
		var tagValue = this.updatedTaskTag && this.updatedTaskTag.trim();
		if (!tagValue) {
			return;
		}
		this.todos.push({
			id: this.todo.id,
			text: value,
			complete: false,
			tag: tagValue,
		});
		this.updatedTodo = "";
	},
};
</script>

<style></style>
