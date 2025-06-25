/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useAIState, useActions, useUIState } from 'ai/rsc'
import { useState } from 'react'
import { SparklesIcon } from '../ui/icons'

interface SelectSeatsProps {
  summary: {
    departingCity: string
    arrivalCity: string
    flightCode: string
    date: string
  }
}

export const suggestions = [
  'Proceed to checkout',
  'List hotels and make a reservation'
]

export const SelectSeats = ({
  summary = {
    departingCity: 'New York City',
    arrivalCity: 'San Francisco',
    flightCode: 'CA123',
    date: '23 March 2024'
  }
}: SelectSeatsProps) => {
  const availableSeats = ['3B', '2D']
  const [aiState, setAIState] = useAIState()
  const [selectedSeat, setSelectedSeat] = useState('')
  const { departingCity, arrivalCity, flightCode, date } = summary
  const [_, setMessages] = useUIState()
  const { submitUserMessage } = useActions()

  return (
    <div>
      <p className="mb-4">
        Great! Here are the available seats for your flight. Please select a
        seat to continue.
      </p>
      <div className="flex flex-col gap-4 dark:text-zinc-300">
        <div className="flex flex-col gap-4 p-4 bg-white border rounded-xl dark:bg-zinc-950">
          <div className="flex flex-row items-center gap-4">
            <div className="size-8 md:size-12">
              <img
                className="border rounded-lg"
                src="https://www.gstatic.com/flights/airline_logos/70px/UA.png"
              />
            </div>
            <div>
              <div className="text-sm text-zinc-500 md:text-base">
                {date} · {flightCode}
              </div>
              <div className="text-sm md:text-base">
                {departingCity} to {arrivalCity}
              </div>
            </div>
          </div>

          <div
            className={`relative flex w-full flex-row justify-center rounded-xl border bg-zinc-600 px-4 font-medium dark:bg-zinc-800`}
          >
            <div className="flex flex-col gap-4 p-4 border-x border-zinc-400 bg-zinc-50">
              {[4, 3, 2, 1].map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex flex-row gap-3">
                  {['A', 'B', 0, 'C', 'D'].map((seat, seatIndex) => (
                    <div
                      key={`seat-${seatIndex}`}
                      className={`align-center relative flex size-6 flex-row items-center justify-center rounded ${
                        seatIndex === 2
                          ? 'transparent'
                          : selectedSeat === `${row}${seat}`
                            ? 'cursor-pointer border-x border-b border-emerald-500 bg-emerald-300'
                            : availableSeats.includes(`${row}${seat}`)
                              ? 'cursor-pointer border-x border-b border-zinc-500 bg-zinc-300'
                              : 'cursor-not-allowed border-x border-b border-zinc-800 bg-zinc-500'
                      }`}
                      onClick={() => {
                        setSelectedSeat(`${row}${seat}`)

                        setAIState({
                          ...aiState,
                          interactions: [
                            `great, I have selected seat ${row}${seat}`
                          ]
                        })
                      }}
                    >
                      {seatIndex === 2 ? (
                        <div className="w-6 text-sm text-center tabular-nums text-zinc-500">
                          {row}
                        </div>
                      ) : (
                        <div
                          className={`absolute top-0 h-2 w-7 rounded border ${
                            selectedSeat === `${row}${seat}`
                              ? 'border-emerald-500 bg-emerald-300'
                              : availableSeats.includes(`${row}${seat}`)
                                ? 'border-zinc-500 bg-zinc-300'
                                : 'border-zinc-800 bg-zinc-500'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex flex-row gap-3">
                {['A', 'B', '', 'C', 'D'].map((seat, index) => (
                  <div
                    key={index}
                    className="w-6 text-sm text-center shrink-0 text-zinc-500"
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedSeat !== '' && (
          <div className="flex flex-row flex-wrap gap-2">
            {suggestions.map(suggestion => (
              <div
                key={suggestion}
                className="flex flex-row items-center gap-2 px-3 py-2 text-sm bg-white border rounded-xl cursor-pointer shrink-0 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                onClick={async () => {
                  const response = await submitUserMessage(suggestion, [])
                  setMessages((currentMessages: any[]) => [
                    ...currentMessages,
                    response
                  ])
                }}
              >
                <SparklesIcon />
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
