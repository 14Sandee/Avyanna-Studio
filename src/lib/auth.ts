"use client";

import { supabase } from "./supabase";

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUser() {
  // Check if user opted out of "remember me"
  if (typeof window !== "undefined" && sessionStorage.getItem("avyanna_no_persist")) {
    // Session-only mode: if page was reloaded (not just navigated), check if session is still valid
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
