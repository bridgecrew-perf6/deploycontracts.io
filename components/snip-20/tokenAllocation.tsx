import { useState } from 'react'
import { useToken } from '@/utils/token'
import AllocationCard from '@/components/AllocationCard'
import SecondaryButton from '@/components/buttons/SecondaryButton'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import ProgressBar from '@/components/ProgressBar'

export default function tokenAllocation() {
  const { allocations, freeAllocationValue, addAllocation, colourPallete, isAllocationMaxItems } = useToken()
  const [formError, setFormError] = useState(false)

  function checkFreeSpace(e: any) {
    if (freeAllocationValue < 100) {
      e.preventDefault()
      setFormError(true)
    } else {
      setFormError(false)
    }
  }

  return (
    <>
      <div className='flex flex-col gap-y-[34px]'>
        <h1 className='font-space-grotesk font-bold text-xl text-white'>Token allocation</h1>
        <p className='text-gray-100'>
          Token generations is.... consectetur adipiscing elit. Etiam pulvinar leo vitae massa congue euismod eget
          convallis tortor.
        </p>
      </div>

      <div className='mt-[41px] flex flex-col gap-y-9'>
        {allocations.map((x, i) => (
          <AllocationCard key={i} index={i} allocation={x} colour={colourPallete[i]} />
        ))}

        <ProgressBar />

        {!isAllocationMaxItems && (
          <SecondaryButton onClick={() => addAllocation()}>
            <div className='px-12 py-4'>Add new</div>
          </SecondaryButton>
        )}
      </div>

      <div className='relative mt-64 sm:mt-40 flex flex-col gap-y-6'>
        {formError && (
          <div className='animate-hide-div absolute bottom-[140%] md:bottom-[140%] z-20 py-4 px-6 text-base text-gray-100 flex flex-row gap-x-6 bg-[#341035] items-center justify-between rounded-3xl'>
            <img src='/assets/error.svg' alt='error icon' className='w-[24px] h-[24px]' />
            To go next step should use all off space.... Proin elementum nunc faucibus lacinia sollicitudin.
            <div className='absolute bottom-[-5px] -z-10 right-[calc(50%-50px)] md:right-[calc(50%-100px)] w-10 h-10 bg-[#341035] rotate-45'></div>
          </div>
        )}
        <div className='flex flex-row justify-between gap-x-16 md:gap-x-[144px]'>
          <div></div>
          <div className='flex-1'>
            <PrimaryButton onClick={checkFreeSpace}>
              <a href='/' className='px-12 py-4 inline-block w-full h-full'>
                Next
              </a>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </>
  )
}
