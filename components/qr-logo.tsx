"use client"

import { useState } from "react"
import { QrCode } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function QRLogo() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-black rounded-lg">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-black">ScanBack</span>
            <p className="text-xs text-gray-600">QR Code Service</p>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Scan ScanBack™</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
            <QrCode className="w-40 h-40 text-gray-800" />
          </div>
          <p className="text-sm text-gray-600 text-center">Scan this QR code with another device to visit ScanBack™</p>
          <p className="text-xs text-gray-500 text-center">scanback.co.za</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
