export async function checkCameraSupport() {
  var hasWebcam = false;
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('Trình duyệt không hỗ trợ truy cập vào thiết bị phần cứng.')
    return
  }

  try {
    let devices = await navigator.mediaDevices.enumerateDevices()
    devices.forEach(function (device) {
      if (device.kind === 'videoinput') {
        hasWebcam = true
      }
    })
  }
  catch (err) {
    console.error('Lỗi khi kiểm tra camera:', err)
  }
  return hasWebcam;
}

export async function checkCameraPermissions() {
  try {
    let cameraPermissions = await navigator.permissions.query({ name: 'camera' });
    if(cameraPermissions.state === 'granted') {
      return true;
    }
  }
  catch(err) {
    console.error('Chưa cấp quyền mở camera:', err)
  }
  return false;
}