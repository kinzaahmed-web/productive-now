<template>
	<div>
		<h1>Todo Details Page</h1>
		<router-link to="/todos">
			<b-button> Go back to all todos! </b-button>
		</router-link>
		<b-container class="mt-3 card shadow shadow-lg--hover">
			<h3 class="m-3">current todo</h3>

			<b-list-group-item
				:class="{ completed: todo.complete }"
				class="d-flex justify-content-between align-items-center"
			>
				<b-form-checkbox
					size="lg"
					aria-label="complete!"
					v-model="todo.complete"
					@input="completedTask()"
				>
				</b-form-checkbox>

				<div class="todo-info">
					<span v-if="todo.complete" class="complete">{{ todo.text }}</span>
					<span v-else>{{ todo.text }}</span>
				</div>
				<b-form-tag
					v-if="todo.tag"
					@remove="removeTagFromTask()"
					:title="tag"
					:disabled="disabled"
					variant="info"
					>{{ todo.tag }}</b-form-tag
				>
				<b-button
					variant="outline-primary"
					title="Delete"
					pill
					@click="deleteTask()"
				>
					<b-icon-trash-fill></b-icon-trash-fill>
				</b-button>
			</b-list-group-item>

			<div class="row">
				<div class="col-md-12 mt-3">
					<b-form @submit.stop.prevent>
						<h3>update task</h3>
						<b-form-input
							v-model="updatedTodo.text"
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
							v-model="updatedTodo.tag"
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
							@click="updateTask"
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
		</b-container>
	</div>
</template>

<script>
import { auth, db } from "@/main";
import { BIconTrashFill } from "bootstrap-vue";
export default {
	name: "TodoDetails",
	props: ["id"],
	components: {
		BIconTrashFill,
	},
	data: function () {
		return {
			tags: [],
			todo: {
				text: "",
				tag: "",
				complete: "",
			},
			updatedTodo: {
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
		getTodo() {
			db.collection("todo")
				.doc(this.id)
				.get()
				.then((snapshot) => {
					const document = snapshot.data();
					this.todo.text = document.text;
					this.todo.tag = document.tag;
					this.todo.complete = document.complete;
				});
			this.updatedTodo = this.todo;
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
		deleteTask() {
			db.collection("todo").doc(this.id).delete();
			alert("Deleted Todo - Rerouting..");
			this.$router.replace({ path: "/todos", replace: true });
		},
		removeTagFromTask() {
			db.collection("todo")
				.doc(this.id)
				.update({ tag: null })
				.then(this.handler);
		},
		updateTask() {
			db.collection("todo")
				.doc(this.id)
				.update({ text: this.updatedTodo.text, tag: this.updatedTodo.tag })
				.then(this.handler);
		},
		completedTask() {
			db.collection("todo")
				.doc(this.id)
				.update({ complete: this.todo.complete })
				.then(this.handler);
		},
		handler() {
			this.getTodo();
			this.getTags();
		},
	},
	computed: {
		taskValidation() {
			return (
				this.updatedTodo.text.length > 3 && this.updatedTodo.text.length < 21
			);
		},
	},
};
</script>

<style>
.complete {
	color: #d9d9d9;
	text-decoration: line-through;
}
</style>
