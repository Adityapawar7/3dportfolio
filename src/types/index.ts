import { ReactNode } from 'react';

export interface ProjectImages {
  topLeft: string;
  bottomLeft: string;
  right: string;
}

export interface ProjectItem {
  id?: string;
  name: string;
  category: string;
  images: ProjectImages;
  liveUrl?: string;
  githubUrl?: string;
}

export interface ServiceItem {
  name: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  as?: keyof HTMLElementTagNameMap | any;
}

export interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

export interface AnimatedTextProps {
  text: string;
  className?: string;
}

export interface TrackingPortraitProps {
  src?: string;
  className?: string;
}
