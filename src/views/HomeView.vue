<script setup>
import { ref } from 'vue';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
const video = ref(null);
const liveView = ref(null);
const demosSection = ref(null);
const onTheScreen = ref(null);
// const audio = ref(null);
const showBtn = ref(false);
const camStarted = ref(false);

let model = undefined;
// loading the model
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  showBtn.value = true;
})

async function enableCamera(event) {
  if(!model) {
    return;
  }

  camStarted.value = true;
  const constraints = {
    video: true
  };

  // Activate the webcam steam
  await navigator.mediaDevices.getUserMedia(constraints).then(function(steam) {
    try {
      video.value.srcObject = steam;
      video.value.style.transform = 'rotateY(180deg)';
      video.value.className = 'mx-auto h-full auto max-w-full rounded-lg';
      console.log('try: ', steam);
    }
    catch(err) {
      console.log('catch: ', err);
    }

    video.value.addEventListener('loadeddata', predictWebcam);
  })
}

const children2 = ref([]);
function predictWebcam() {
  // classifying a frame in the steam

  model.detect(video.value).then(function (predictions) {
    for (let i = 0; i < children2.value.length; i++) {
      onTheScreen.value.removeChild(children2.value[i]);
    }

    children2.value.splice(0);

    // loop through predictions
    for(let n = 0; n < predictions.length; n++) {
      if(predictions[n].score > 0.66) {
        const div = document.createElement('div');
        div.innerHTML = predictions[n].class;
        div.className = 'inline-block bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300';
        // if(predictions[n].class === 'preson') {}
        onTheScreen.value.appendChild(div);
        children2.value.push(div);
      }
    }

    window.requestAnimationFrame(predictWebcam);
  })
}
</script>
<template>
  <div class="container min-h-screen py-5 mx-auto text-center">
    <div class="py-5">
      <h1 class="text-3xl font-bold mb-4">Camera</h1>
      <p class="text-2xl">Multiple object detection</p>
    </div>
    <div v-if="!showBtn" class="my-5 text-center">
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto mb-3" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
      <span>Loading...</span>
    </div>
    <div v-else ref="demosSection">
      <div ref="liveView" class="camView">
        <button v-if="!camStarted" @click="enableCamera" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Enable Camera</button>
        <div class="h-96 w-full rounded-xl mx-auto">
          <video ref="video" autoplay muted >
          </video>
        </div>
        <p>The detected object</p>
        <p ref="onTheScreen" class="h-48"></p>
      </div>
    </div>
  </div>
</template>