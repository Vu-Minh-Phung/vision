<script setup>
import { onMounted, ref } from 'vue'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import { CameraIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/vue/20/solid'
import { checkCameraSupport } from '@/utils'

const video = ref(null)
const isLoadModule = ref(false)

const haveCamera = ref(false);
const camStarted = ref(false)

let model = undefined
// loading the model
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel
  isLoadModule.value = true
})

async function enableCamera() {
  if(!model || !haveCamera.value) {
    return;
  }

  camStarted.value = true;
  const constraints = {
    video: true
  };

  console.log('abc')
  // Activate the webcam steam
  await navigator.mediaDevices.getUserMedia(constraints).then(function(steam) {
    try {
      video.value.srcObject = steam;
      video.value.style.transform = 'rotateY(180deg)';
      video.value.className = 'h-full w-full object-cover';
      console.log('try: ', steam);
    }
    catch(err) {
      console.log('catch: ', err);
    }

    // video.value.addEventListener('loadeddata', predictWebcam);
  })
}

onMounted(async () => {
  haveCamera.value = checkCameraSupport()
  console.log(haveCamera.value)
})
</script>
<template>
  <div class="container px-4 mx-auto">
    <div class="py-16 max-w-7xl mx-auto">
      <div
        class="relative w-full bg-gray-300 rounded-3xl overflow-hidden"
        style="padding-top: 56.25%"
      >
        <div class="absolute top-0 left-0 right-0 bottom-0">
          <video ref="video" autoplay muted class="h-full w-full"></video>
        </div>
        <div class="absolute bottom-5 left-0 right-0 flex justify-center gap-4 pointer-events-none">
          <label
            class="flex items-center justify-center relative h-13 w-13 bg-black bg-opacity-15 rounded-full pointer-events-auto cursor-pointer transition duration-200 hover:bg-gray-400"
          >
            <PhotoIcon class="w-5 h-5 text-white" />
            <input type="file" class="hidden">
          </label>
          <div
            v-if="camStarted && haveCamera"
            class="flex items-center justify-center relative h-13 w-13 bg-black bg-opacity-15 rounded-full pointer-events-auto cursor-pointer transition duration-200 hover:bg-gray-400"
          >
            <CameraIcon class="w-5 h-5 text-white" />
          </div>
          <div
            v-if="!camStarted"
            class="flex items-center justify-center relative h-13 w-13 bg-black bg-opacity-15 rounded-full pointer-events-auto transition duration-200"
            :class="{ 'cursor-not-allowed opacity-70': !haveCamera, 'hover:bg-gray-400 cursor-pointer': haveCamera }"
            title="Không tìm thấy máy ảnh"
            @click="enableCamera"
          >
            <VideoCameraIcon class="w-5 h-5 text-white" />
          </div>
        </div>
        <div
          class="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-5 z-10"
          v-if="!isLoadModule"
        >
          <div role="status" class="mb-4">
            <svg
              aria-hidden="true"
              class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <div class="text-gray-100 text-lg font-light">Loading...</div>
        </div>
      </div>
    </div>
  </div>
</template>
