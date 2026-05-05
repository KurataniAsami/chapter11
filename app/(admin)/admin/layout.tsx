// 管理者
"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useRouteGuard } from "@/_hooks/useRouteGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useRouteGuard()

  const pathname = usePathname()
  const isSelected = (href: string) => {
    return pathname.includes(href)
  }

  return (
    <div>
      <h1 className="bg-gray-600 text-white px-5 py-5 font-bold text-2xl">blog(管理者ページ)</h1>
      <div className="flex">
        <aside className="w-64 bg-gray-200 min-h-screen flex flex-col">
          <Link href={'/admin'}
            className={`p-4 block hover:bg-blue-100 ${
              isSelected('/admin') && 'bg-blue-100'
            }`}
          >
            記事一覧
          </Link>

          <Link href={"/admin/categories"}
            className={`p-4 block hover:bg-blue-100 ${
              isSelected('/admin') && 'bg-blue-100'
            }`}
          >
            カテゴリー一覧
          </Link>
        </aside>

        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}



