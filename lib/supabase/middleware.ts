import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require auth
  const isAuthRoute = pathname.startsWith("/login") ||
    pathname.startsWith("/registro") ||
    pathname.startsWith("/invitacion") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/consentimiento");

  const isRootPage = pathname === "/";

  // Unauthenticated user trying to access protected routes
  if (!user && !isAuthRoute && !isRootPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated user on auth routes → redirect to their shell
  if (user && (isAuthRoute || isRootPage)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = profile?.role === "therapist"
      ? "/terapeuta/pacientes"
      : "/paciente";
    return NextResponse.redirect(url);
  }

  // Authenticated user without consent → redirect to consent page
  if (user && !isAuthRoute && !isRootPage) {
    const { data: consentProfile } = await supabase
      .from("profiles")
      .select("consent_given_at")
      .eq("id", user.id)
      .single();

    if (consentProfile && !consentProfile.consent_given_at) {
      const url = request.nextUrl.clone();
      url.pathname = "/consentimiento";
      return NextResponse.redirect(url);
    }
  }

  // Authenticated user on wrong role's routes → redirect
  if (user) {
    const isTherapistRoute = pathname.startsWith("/terapeuta");
    const isPatientRoute = pathname.startsWith("/paciente");

    if (isTherapistRoute || isPatientRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (profile.role === "patient" && isTherapistRoute) {
          const url = request.nextUrl.clone();
          url.pathname = "/paciente";
          return NextResponse.redirect(url);
        }
        if (profile.role === "therapist" && isPatientRoute) {
          const url = request.nextUrl.clone();
          url.pathname = "/terapeuta/pacientes";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return supabaseResponse;
}
