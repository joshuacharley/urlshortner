'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function QRCodeComponent({ url, size = 100 }: { url: string, size?: number }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(url, { width: size, margin: 1 })
      .then((dataURL) => setQRCodeDataURL(dataURL))
      .catch((error) => console.error('Error generating QR code:', error))
  }, [url, size])

  if (!qrCodeDataURL) {
    return null
  }

  return (
    <div className="qr-code">
      <img src={qrCodeDataURL} alt="QR Code" width={size} height={size} />
    </div>
  )
}