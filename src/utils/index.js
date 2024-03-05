export function checkCameraSupport() {
  var hasWebcam = false;
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('Trình duyệt không hỗ trợ truy cập vào thiết bị phần cứng.')
    return
  }

  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        if (device.kind === 'videoinput') {
          hasWebcam = true
        }
      })
    })
    .catch(function (err) {
      console.error('Lỗi khi kiểm tra camera:', err)
    })
  return hasWebcam;
}
