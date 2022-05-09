import { useState } from 'react'
type Props = {
  files: object[]
  onDelete: () => void
}

export default function LoadedLogo({ files, onDelete }: Props) {
  const [deleteImage, setDeleteImage] = useState('/assets/delete-default.svg')
  return (
    <>
      {files.map((file: any, idx) => {
        return (
          <div key={idx} className='px-6 py-9 flex flex-row justify-between items-center bg-[#0F204D] rounded-2xl'>
            <div className='flex flex-row items-center gap-x-5 font-normal'>
              <img
                src={file.preview}
                alt='icon'
                className=' w-14 h-14'
                onLoad={() => {
                  URL.revokeObjectURL(file.preview)
                }}
              />
              <div className='text-base text-gray-100 leading-5'>{file.name}</div>
            </div>
            <button
              className='flex items-center justify-center w-[64px] h-[64px] rounded-full hover:bg-[#0F204C]'
              onClick={() => onDelete()}
              onMouseEnter={() => setDeleteImage('/assets/delete-active.svg')}
              onMouseLeave={() => setDeleteImage('/assets/delete-default.svg')}
            >
              <img src={deleteImage} className='w-6 h-6 cursor-pointer' alt='delete button icon' />
            </button>
          </div>
        )
      })}
    </>
  )
}
