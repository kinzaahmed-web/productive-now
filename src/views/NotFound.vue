<template>
	<div class="container">
		<div class="row">
			<div class="col-md-12 m-3">
				<div class="error-template">
					<h1>Oops!</h1>
					<h2>Page Not Found</h2>
					<div class="error-details">
						Sorry, an error has occured, Requested page not found!
					</div>
					<router-link to="todos">
						<b-button class="mt-4">Go home?</b-button>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
.not-found {
	background-color: white;
	border-radius: 10px;
	padding: 30px;
	margin: 10% auto;
	text-align: center;
	width: 30%;
}
</style>
