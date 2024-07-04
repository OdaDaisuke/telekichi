'use client'

import Link from 'next/link';
import { usePathname } from "next/navigation";

interface IProps {
}

export const AppMenu = (props: IProps) => {
  const currentPagePath = usePathname();
  const links = [
    { label: "HOME", pathname: "/" },
    { label: "録画済み", pathname: "/recording/list" },
    { label: "録画設定一覧", pathname: "/recording/setting/list" },
    { label: "全体設定", pathname: "/setting" },
  ]

  const commonStyle = {
    borderRadius: '6px',
    color: "white",
    display: "block",
    fontSize: '14px',
    letterSpacing: '1px',
    marginBottom: '3px',
    padding: "12px 18px",
    textDecoration: "none",
  }

  return <div className="px-8">
    {links.map(({ label, pathname }) => {
      if (currentPagePath === pathname) {
        return <Link style={{ ...commonStyle, backgroundColor: '#4D4D51', fontWeight: 'bold' }} href={{ pathname }} key={label}>{label}</Link>
      }
      return <Link style={{ ...commonStyle }} href={{ pathname }} key={label}>{label}</Link>
    })}
  </div>
}
