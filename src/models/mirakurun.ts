export interface MirakurunService {
  id: number
  serviceId: number
  networkId: number
  name: string
}

export type MirakurunChannelType = "GR" | "BS" | "CS"

export interface MirakurunChannel {
  type: MirakurunChannelType
  channel: string
  name: string
  services: MirakurunService[]
}

export type MirakurunChannelList = Array<MirakurunChannel>

interface MirakurunVideo {
  type: string;
  resolution: string;
  streamContent: number;
  componentType: number;
}

interface MirakurunGenre {
  lv1: number;
  lv2: number;
  un1: number;
  un2: number;
}

interface MirakurunAudio {
  componentType: number;
  componentTag: number;
  isMain: boolean;
  samplingRate: number;
  langs: string[];
}

interface MirakurunRelatedItem {
  type: string;
  serviceId: number;
  eventId: number;
}

export interface MirakurunEvent {
  id: number;
  eventId: number;
  serviceId: number;
  networkId: number;
  startAt: number;
  duration: number;
  isFree: boolean;
  _pf: boolean;
  name: string;
  description: string;
  video: MirakurunVideo;
  genres: MirakurunGenre[];
  audios: MirakurunAudio[];
  relatedItems: MirakurunRelatedItem[];
}