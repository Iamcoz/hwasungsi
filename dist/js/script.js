// const tl = gsap.timeline({
// 	scrollTrigger: {
// 		trigger: "#hero",
// 		start: "top top",
// 		end: "bottom top",
// 		scrub: true
// 	}
// });

// gsap.utils.toArray(".parallax").forEach(layer => {
// 	const depth = layer.dataset.depth;
// 	const movement = -(layer.offsetHeight * depth)
// 	tl.to(layer, {y: movement, ease: "none"}, 0)
// });

document.addEventListener('DOMContentLoaded', () => {
	let nav = document.getElementById('bottom-nav');
	let home = document.getElementById('home');
  
	let timeline1 = new TimelineMax();
	timeline1
	  .to('.layers', 1, {y: 360, ease: Power3.easeInOut})
	  .from('.bottom-nav', 2, {width: '0%', autoAlpha: 0, ease: Power3.easeInOut}, '-=1.5')
	  .from('.box', 0.5, {y: 800, autoAlpha: 0, ease: Power3.easeInOut}, '-=0.5')
	  .from('nav', 2, {y: 0, autoAlpha: 0, scale: 1.8, ease: Power3.easeInOut}, '-=0.5');
});
