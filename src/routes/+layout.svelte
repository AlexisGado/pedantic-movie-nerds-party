<div class="cool-bg">
	<slot />
</div>

<style>
	:root {
		--red-bg: #801b22;
	}
	:global(body) {
		margin: 0;
		padding: 0;
	}
	:global(h1) {
		margin: 0;
	}
	.cool-bg {
		background: repeating-linear-gradient(
			100deg,
			var(--red-bg),
			var(--red-bg) 100px,
			#000 100px,
			#000 103px
		);
		min-height: 100vh;
	}
</style>
