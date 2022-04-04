<template>
	<div class="sign-up">
		<h3>let's create a new account!</h3>
		<input type="text" placeholder="email" /><br />
		<input type="password" placeholder="password" /><br />
		<button @click="signUp">sign up</button>
		<span
			>already have an account?
			<router-link to="/login">login!</router-link></span
		>
	</div>
</template>

<script>
import firebase from "firebase/compat/app";
export default {
	name: "SignUpView",
	data() {
		return {
			email: "",
			password: "",
		};
	},
	methods: {
		signUp: function () {
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.email, this.password)
				.then(
					() => {
						this.$router.replace("todos");
					},
					(err) => {
						alert("Oops. " + err.message);
					}
				);
		},
	},
};
</script>

<style scoped>
/* "scoped" attribute limits the CSS to this component only */
.sign-up {
	margin-top: 40px;
}
input {
	margin: 10px 0;
	width: 20%;
	padding: 15px;
}
button {
	margin-top: 20px;
	width: 10%;
	cursor: pointer;
}
span {
	display: block;
	margin-top: 20px;
	font-size: 11px;
}
</style>
