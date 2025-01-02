'use client'

import { useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Undo2, Redo2, Download, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CanvasDraw = dynamic(() => import('react-canvas-draw'), {
  ssr: false,
})

interface DrawingCanvasProps {
  onSave: (base64Image: string) => void
  initialDrawing?: string
  width?: number
  height?: number
}

export default function DrawingCanvas({
  onSave,
  initialDrawing,
  width = 400,
  height = 400,
}: DrawingCanvasProps) {
  
  const canvasRef = useRef<any>(null)
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(2)
  const [brushColor, setBrushColor] = useState('#000000')

  const handleSave = useCallback(() => {
    if (canvasRef.current) {
      // Get base64 image data instead of save data
      const dataUrl = canvasRef.current.getDataURL()
      onSave(dataUrl)
    }
  }, [onSave])

  const loadInitialDrawing = useCallback(() => {
    if (initialDrawing && canvasRef.current) {
      const img = new Image()
      img.src = initialDrawing
      img.onload = () => {
        const canvas = canvasRef.current.canvasContainer.children[1]
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        setIsDrawing(true)
      }
    }
  }, [initialDrawing])

  const handleUndo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.undo()
    }
  }, [])

  const handleRedo = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.redo()
    }
  }, [])

  const handleClear = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.clear()
      setIsDrawing(false)
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.getDataURL()
      const link = document.createElement('a')
      link.download = 'drawing.png'
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [])

  const colorOptions = [
    { value: '#000000', label: 'Black' },
    { value: '#FF0000', label: 'Red' },
    { value: '#00FF00', label: 'Green' },
    { value: '#0000FF', label: 'Blue' },
    { value: '#FFFF00', label: 'Yellow' },
    { value: '#FF00FF', label: 'Pink' },
    { value: '#00FFFF', label: 'Cyan' },
    { value: '#FFFFFF', label: 'White' }
  ];

  const brushSizes = [2, 4, 6, 8, 10]


  
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Brush Color
        </label>
        <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
              key={color.value}
                className={`w-8 h-8 rounded-full border-2 ${
                  brushColor === color.value ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setBrushColor(color.value)}
              />
            ))}
          </div>
        </div>
        <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Brush Size
        </label>
        <div className="flex flex-wrap gap-2">
            {brushSizes.map((size) => (
              <button
                key={size}
                className={`w-8 h-8 rounded border ${
                  brushSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
                onClick={() => setBrushSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={canvasRef} className="border border-gray-300 rounded">
        <CanvasDraw
           brushRadius={brushSize}
           brushColor={brushColor}
           lazyRadius={0}
           canvasWidth={width}
           canvasHeight={height}
           hideGrid
           onChange={() => setIsDrawing(true)}
        />
      </div>

      <div className="flex space-x-2">
        <Button
          onClick={handleUndo}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleRedo}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleClear}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          title="Clear Canvas"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleDownload}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          title="Download Drawing"
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleSave}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!isDrawing}
          title="Save Drawing"
        >
          <Save className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}