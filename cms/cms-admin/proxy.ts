// file: src/middleware.ts (hoặc middleware.ts ở thư mục gốc)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  // Lấy token từ Cookie (Hỗ trợ cả cms_token tự code và next-auth token)
  const token = request.cookies.get('cms_token')?.value || 
                request.cookies.get('next-auth.session-token')?.value || 
                request.cookies.get('__Secure-next-auth.session-token')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // 1. Nếu chưa đăng nhập và đang cố vào các trang quản trị -> Đá về /login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Nếu đã đăng nhập mà lại cố vào trang /login -> Đá về Trang chủ
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Chỉ định các đường dẫn Middleware sẽ chạy (Bỏ qua API và file tĩnh)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}