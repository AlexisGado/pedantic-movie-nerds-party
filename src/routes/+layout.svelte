<div class="cool-bg">
	<slot />
</div>

<style>
	:root {
		--red-bg: #801b22;
		--dark-red-bg: #470b10;
		--beige: #c8b29a;

		--font-family: 'Courier New', Courier, monospace;
	}
	.cool-bg {
		width: 100%;
		background: repeating-linear-gradient(
			100deg,
			var(--red-bg),
			var(--red-bg) 100px,
			var(--dark-red-bg) 100px,
			var(--dark-red-bg) 103px
		);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
