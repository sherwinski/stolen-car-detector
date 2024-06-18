'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'

export default function NavigationBar() {
  return (
    <NavigationMenu className="self-end">
      <NavigationMenuList className="flex gap-1 text-xl text-slate-300">
        <NavigationMenuItem className="hover:bg-slate-700 hover:bg-opacity-60 rounded-sm px-4 py-1">
          <Link href="/">Home</Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hover:bg-slate-700 hover:bg-opacity-60 rounded-sm px-4 py-1">
          <Link href="/upload">Upload</Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
