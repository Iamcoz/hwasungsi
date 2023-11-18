document.addEventListener('DOMContentLoaded', () => {
	let nav = document.getElementById('bottom-nav');
	let home = document.getElementById('home');

	let timeline1 = new TimelineMax();
	timeline1
		.to('.layers', 1, { y: 360, ease: Power3.easeInOut })
		.from('.bottom-nav', 2, { width: '0%', autoAlpha: 0, ease: Power3.easeInOut }, '-=1.5')
		.from('.box', 0.5, { y: 800, autoAlpha: 0, ease: Power3.easeInOut }, '-=0.5')
		.from('nav', 2, { y: 0, autoAlpha: 0, scale: 1.8, ease: Power3.easeInOut }, '-=0.5');
});
