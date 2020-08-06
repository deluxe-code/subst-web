export function qr() {
    jQuery('#qrcodeCanvas').qrcode({width: 100,height: 100,text: window.location.href});
}