'use client'

import Image from 'next/image'

export default function HolographicAnimation() {
  return (
    <div className="relative w-[170px] h-[170px] mx-auto mb-8">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue%20and%20Black%20Neon%20Holographic%20Mobile%20Video%20Background%20(2)-ezI5dBnNhTb7lHkH8cECuS8wdkpesF.gif"
        alt="Holographic Animation"
        width={150}
        height={150}
        className="object-contain"
        priority
      />
    </div>
  )
}

