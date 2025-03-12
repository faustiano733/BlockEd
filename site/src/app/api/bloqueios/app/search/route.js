import { NextResponse } from "next/server.js"
import {getApp, activeApp, getAllApps, suggestApps} from "@lib/services/appServices.js"

export async function GET(req){
  const url = new URL(req.url)
  const term = url.searchParams.get("term")
  const apps = await suggestApps(term);

  return NextResponse.json(apps);

}