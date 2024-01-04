import Link from 'next/link'
import React from 'react'
import { ThemeSwitcherButton } from './theme-switcher-button'

const Header = () => {
  return (
    <header className="container flex justify-between items-center py-5">
    <h1 className="text-3xl cursor-pointer  hover:text-zinc-600 hover:scale-110">
      <Link href="/">
        Link Shortener
        <span className="text-[13px] font-thin italic">By Own3r</span>
      </Link>
    </h1>
    <ThemeSwitcherButton />
  </header>
  )
}

export default Header