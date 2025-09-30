const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './FGH.mind',
			maxTrack: 3,
        });

        const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
 		const Fan = await  loadGLTF('./Fan/scene.gltf');
		Fan.scene.scale.set(0.008, 0.008, 0.0008);
		
		// calling FanAclip and we are loading the audio from our hard disk
		const FanAclip = await loadAudio("./sound/Fan.mp3");
		const FanListener = new THREE.AudioListener();
		const FanAudio = new THREE.PositionalAudio(FanListener);
		
		const Golf = await  loadGLTF('./Golf/scene.gltf');
		Golf.scene.scale.set(0.50, 0.50,0.50);
		
		const Hen = await  loadGLTF('./Hen/scene.gltf');
		Hen.scene.scale.set(0.1, 0.1, 0.1);
		Hen.scene.position.set(0, -0.4, 0);
		
		const GolfMixer = new THREE.AnimationMixer(Golf.scene);
		const GolfAction = GolfMixer.clipAction(Golf.animations[0]);
		GolfAction.play();
		
		const GolfAclip = await loadAudio("./sound/Golf.mp3");
		const GolfListener = new THREE.AudioListener();
		const GolfAudio = new THREE.PositionalAudio(GolfListener);
		
		const HenMixer = new THREE.AnimationMixer(Hen.scene);
		const HenAction = HenMixer.clipAction(Hen.animations[0]);
		HenAction.play();
		
		const HenAclip = await loadAudio("./sound/Hen.mp3");
		const HenListener = new THREE.AudioListener();
		const HenAudio = new THREE.PositionalAudio(HenListener);
		
		const FanAnchor = mindarThree.addAnchor(0);
		FanAnchor.group.add(Fan.scene);
		camera.add(FanListener);
		FanAudio.setRefDistance(300);
		FanAudio.setBuffer(FanAclip);
		FanAudio.setLoop(true);
		FanAnchor.group.add(FanAudio)
		
		FanAnchor.onTargetFound = () => {
			FanAudio.play();
		}
		
		FanAnchor.onTargetLost = () => {
			FanAudio.pause(); 
		}
		
		const GolfAnchor = mindarThree.addAnchor(1);
		GolfAnchor.group.add(Golf.scene);
		camera.add(GolfListener);
		GolfAudio.setRefDistance(300);
		GolfAudio.setBuffer(GolfAclip);
		GolfAudio.setLoop(true);
		GolfAnchor.group.add(GolfAudio)
		
		GolfAnchor.onTargetFound = () => {
			GolfAudio.play();
		}
		
		GolfAnchor.onTargetLost = () => {
			GolfAudio.pause(); 
		}
		
		
		const HenAnchor = mindarThree.addAnchor(2);
		HenAnchor.group.add(Hen.scene);
		camera.add(HenListener);
		HenAudio.setRefDistance(300);
		HenAudio.setBuffer(HenAclip);
		HenAudio.setLoop(true);
		HenAnchor.group.add(HenAudio)
		
		HenAnchor.onTargetFound = () => {
			HenAudio.play();
		}
		
		HenAnchor.onTargetLost = () => {
			HenAudio.pause(); 
		}
		
		const clock = new THREE.Clock();
		
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			HenMixer.update(delta);
			GolfMixer.update(delta);
			Golf.scene.rotation.set(0, Golf.scene.rotation.y + delta, 0);
			Fan.scene.rotation.set(0, Fan.scene.rotation.y + delta, 0);
			Hen.scene.rotation.set(0, Hen.scene.rotation.y + delta, 0);
            renderer.render(scene, camera);
        });
    }

    start();
});