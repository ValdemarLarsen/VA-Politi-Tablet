"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"

export default function Calculator() {
  const { darkMode } = useSettings()
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return firstValue / secondValue
      case "=":
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const buttons = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ]

  return (
    <div className={`h-full p-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      {/* Display */}
      <div
        className={`text-right text-2xl p-4 mb-4 rounded font-mono ${
          darkMode ? "bg-gray-900 text-white" : "bg-black text-white"
        }`}
      >
        {display}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn, index) => (
          <Button
            key={index}
            variant={["÷", "×", "-", "+", "="].includes(btn) ? "default" : "secondary"}
            className={`h-12 text-lg font-semibold ${
              btn === "0" ? "col-span-2" : ""
            } ${btn === "C" ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
            onClick={() => {
              if (btn === "C") {
                clear()
              } else if (btn === "=") {
                performCalculation()
              } else if (["÷", "×", "-", "+"].includes(btn)) {
                inputOperation(btn)
              } else if (btn === "±") {
                setDisplay(String(Number.parseFloat(display) * -1))
              } else if (btn === "%") {
                setDisplay(String(Number.parseFloat(display) / 100))
              } else {
                inputNumber(btn)
              }
            }}
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  )
}
