import React from 'react'
import { BsSearch, BsMic } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'

const Nav = ({addEditor}) => {
  return (
    <div className='py-5'>

    <div className='flex gap-5 items-center justify-center pb-5'>
        <div className='flex gap-2 w-fit pl-5 pr-48 rounded-md items-center bg-secondary py-2'>
            <BsSearch />
            <input type="text" placeholder='Search Notes' className='bg-secondary outline-none'/>
        </div>
        <div className='w-2 h-8 bg-[#047405]'>
        </div>
        <BiEdit className='bg-tertiary text-primary text-2xl rounded-md hover:cursor-pointer' onClick={addEditor}/>
        <BsMic className='text-xl text-white/60 hover:cursor-pointer'/>
    </div>
        <div className='w-screen h-0.5 bg-secondary'></div>
    </div>
  )
}

export default Nav