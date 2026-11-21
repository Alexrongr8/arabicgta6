"use client";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type LeonidaMap from "./LeonidaMap";

const Map = dynamic(() => import("./LeonidaMap"), {
  ssr: false,
  loading: () => <div className="grid h-[calc(100dvh-64px)] place-items-center text-sm text-muted">…</div>,
});

export function MapShell(props: ComponentProps<typeof LeonidaMap>) {
  return <Map {...props} />;
}
