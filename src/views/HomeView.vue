<template>
	<div class="home">
		<button @click="logout">log out</button>
	</div>
</template>

<script>
import firebase from "firebase/compat/app";

export default {
	name: "HomeView",
	methods: {
		logout: function () {
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.$router.replace("login");
				});
		},
	},
};
</script>
