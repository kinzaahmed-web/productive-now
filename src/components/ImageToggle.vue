<template>
	<div>
		<span> text </span>
		<img :src="getImageUrl()" @click="state = !state" />
	</div>
</template>

<script>
export default {
	name: "ImageToggle",
	props: ["img1", "img2"],
	data: function () {
		return {
			state: true,
		};
	},
	methods: {
		getImageUrl: function () {
			if (this.state) {
				return this.img1;
			} else {
				return this.img2;
			}
		},
	},
};
</script>

<style scoped></style>
