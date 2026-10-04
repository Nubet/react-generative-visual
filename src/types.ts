import type { CSSProperties, ReactNode } from "react";

export interface GenerativeVisualOptions {
  seed: string;
  colors: string[];
  complexity?: number;
  contrast?: number;
  distortion?: number;
  softness?: number;
  texture?: number;
  vignette?: boolean;
}

export interface GenerativeVisualProps extends GenerativeVisualOptions {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
