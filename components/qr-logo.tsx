"use client"

import { useState } from "react"
import { QrCode } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function QRLogo() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          {/* QR Code Icon */}
          <div className="relative w-10 h-10">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              {/* Rounded square background */}
              <rect x="2" y="2" width="36" height="36" rx="4" fill="#14b8a6" stroke="#0f766e" strokeWidth="1"/>
              
              {/* Position detection patterns (corners) - white */}
              <rect x="6" y="6" width="8" height="8" fill="white"/>
              <rect x="8" y="8" width="4" height="4" fill="#14b8a6"/>
              
              <rect x="26" y="6" width="8" height="8" fill="white"/>
              <rect x="28" y="8" width="4" height="4" fill="#14b8a6"/>
              
              <rect x="6" y="26" width="8" height="8" fill="white"/>
              <rect x="8" y="28" width="4" height="4" fill="#14b8a6"/>
              
              {/* Data modules - white squares and dots */}
              <rect x="16" y="6" width="2" height="2" fill="white"/>
              <rect x="20" y="6" width="2" height="2" fill="white"/>
              <rect x="24" y="6" width="2" height="2" fill="white"/>
              
              <rect x="16" y="10" width="2" height="2" fill="white"/>
              <rect x="20" y="10" width="2" height="2" fill="white"/>
              <rect x="24" y="10" width="2" height="2" fill="white"/>
              
              <rect x="16" y="14" width="2" height="2" fill="white"/>
              <rect x="20" y="14" width="2" height="2" fill="white"/>
              <rect x="24" y="14" width="2" height="2" fill="white"/>
              
              <rect x="16" y="18" width="2" height="2" fill="white"/>
              <rect x="20" y="18" width="2" height="2" fill="white"/>
              <rect x="24" y="18" width="2" height="2" fill="white"/>
              
              <rect x="16" y="22" width="2" height="2" fill="white"/>
              <rect x="20" y="22" width="2" height="2" fill="white"/>
              <rect x="24" y="22" width="2" height="2" fill="white"/>
              
              {/* Right side data modules */}
              <rect x="26" y="16" width="2" height="2" fill="white"/>
              <rect x="26" y="20" width="2" height="2" fill="white"/>
              
              {/* Bottom side data modules */}
              <rect x="16" y="26" width="2" height="2" fill="white"/>
              <rect x="20" y="26" width="2" height="2" fill="white"/>
              <rect x="24" y="26" width="2" height="2" fill="white"/>
              
              {/* Additional data dots for realistic look */}
              <rect x="30" y="16" width="2" height="2" fill="white"/>
              <rect x="30" y="20" width="2" height="2" fill="white"/>
              <rect x="30" y="24" width="2" height="2" fill="white"/>
              <rect x="30" y="28" width="2" height="2" fill="white"/>
            </svg>
          </div>
          
          {/* ScanBack Text with TM */}
          <span className="text-xl font-bold text-navy-900">ScanBack™</span>
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
